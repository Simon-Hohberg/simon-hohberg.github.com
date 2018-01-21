import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PostLoaderService } from '../post-loader.service';
import { Post } from '../post';

@Component({
  selector: 'app-post-thumb',
  templateUrl: './post-thumb.component.html',
  styleUrls: ['./post-thumb.component.css']
})
export class PostThumbComponent implements OnInit {

  @Input() id: string;
  @ViewChild('summary') summary: ElementRef;

  private post: Post;

  constructor(private postLoader: PostLoaderService) {
    this.post = new Post();
  }

  ngOnInit() {
    if (this.id) {
      this.postLoader.load(this.id).then((post: Post) => {
        this.post = post;
        this.summary.nativeElement.innerHTML = post.summary;
      });
    }
  }

  getFormattedDate() {
    if (this.post) {
      let month = this.post.date.getMonth() + 1;
      let day = this.post.date.getDate();
      return this.post.date.getFullYear() + "/" + (month > 9 ? month : "0" + month) + "/" + (day > 9 ? day : "0" + day);
    }
    return "";
  }
}
