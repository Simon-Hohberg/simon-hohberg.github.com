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
    {
      id: "2014-10-10-conv-net",
      imgThumbUrl: ""
    },
    {
      id: "2015-07-19-maxout",
      imgThumbUrl: ""
    }
  ]

  constructor() {
    
  }
}
