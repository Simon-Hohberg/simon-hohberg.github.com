import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'Simon Hohberg\'s Web Page';

  articles: Array<string> = [
    "_posts/2015-07-19-maxout",
    "_posts/2014-10-10-conv-net",
    "_posts/2013-12-10-perso"
  ];
  projects: Array<string> = [
    "_projects/2014-01-01-viola-jones",
    "_projects/2014-07-16-mr-ensemble"
  ];
  publications: Array<string> = [
    "_publications/2015-09-20-master-thesis",
    "_publications/2012-02-27-bachelor-thesis",
    "_publications/2012-05-01-traffic-eval"
  ];
  posts: Array<string> = [].concat(this.articles).concat(this.projects).concat(this.publications);
  onStartpage: boolean = true;

  constructor() {
    
  }

  showBlog() {
    this.posts = this.articles;
    this.onStartpage = false;
  }

  showProjects() {
    this.posts = this.projects;
    this.onStartpage = false;
  }

  showPublications() {
    this.posts = this.publications;
    this.onStartpage = false;
  }
}
