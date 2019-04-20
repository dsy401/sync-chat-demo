import { Component, OnInit } from '@angular/core';
import io from 'node_modules/socket.io-client';
import * as $ from 'jquery';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public message;
  public socket;
  public username;
  public date: Date;
  public remainder = 1;
  ngOnInit(): void {
    const node = document.querySelector('.chat-message-counter');
    const observer = new MutationObserver((mutations => {
      mutations.forEach(() => {
        this.remainder = 0;
      });
    }));

    observer.observe(node, {
      attributes: true,
    });
    this.date = new Date();
    const output = document.getElementById('chat-history');
    this.socket = io.connect('http://192.168.178.76:3000');
    (() => {

      $('#live-chat header').on('click', () => {
        $('.chat').slideToggle(300, 'swing');
        $('.chat-message-counter').fadeToggle(300, 'swing');

      });

      $('.chat-close').on('click', e => {

        e.preventDefault();
        $('#live-chat').fadeOut(300);

      });

    }) ();
    this.socket.on('getusername', (data) => {
      this.username = data.username;
    });

    this.socket.on('typing', data => {
      document.getElementById('chat-feedback').innerHTML = data.username + ' is typing ...';
      setTimeout(() => {
        document.getElementById('chat-feedback').innerHTML = null;
      }, 1000);
    });

    this.socket.on('chat', (data) => {
      // @ts-ignore
      if (document.getElementsByClassName('chat-message-counter')[0].style.display == 'inline') {
        this.remainder += 1;
      }
      $(document).ready(() => {
        $('#chat-history').scrollTop($('#chat-history')[0].scrollHeight);
      });
      output.innerHTML += "<div class='chat-message clearfix'><div class='chat-message-content clearfix'><span class='date-time'>"+
        data.datetime + "</span><h5>"+data.username +"</h5><p>"+data.message+"</p></div></div><hr>"
    });
  }

  SendMessage = () => {
    if (this.message==undefined){
      this.message = ""
    }
    this.socket.emit('chat', {
      message: this.message,
      datetime: this.getDateTime(),
      username : this.username
    });
    this.message = '';
    $(document).ready(()=>{
      $('#chat-history').scrollTop($('#chat-history')[0].scrollHeight);
    });
  }

  getDateTime = () =>{
    let result = '';
    let hours = this.date.getHours().toString();
    let mins = this.date.getMinutes().toString();
    if (this.date.getHours().toString().length == 1){
      hours = '0' + this.date.getHours().toString();
    }
    if (this.date.getMinutes().toString().length ==1){
      mins = '0' + this.date.getMinutes().toString();
    }
    result = hours + ':' + mins;
    return result;
  }

  typing(){
    this.socket.emit('typing',{
      username: this.username
    });
  }


}
