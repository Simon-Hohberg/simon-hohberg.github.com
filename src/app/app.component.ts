import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'Simon Hohberg\'s Web Page';

  posts = [
    "2015-07-19-maxout",
    "2014-10-10-conv-net",
    "2013-12-10-perso"
  ]

  constructor() {
    
  }
}
