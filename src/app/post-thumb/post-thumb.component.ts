import { Component, Input, OnInit } from '@angular/core';
import { PostLoaderService } from '../post-loader.service';
import { Post } from '../post';

@Component({
  selector: 'app-post-thumb',
  templateUrl: './post-thumb.component.html',
  styleUrls: ['./post-thumb.component.css']
})
export class PostThumbComponent implements OnInit {

  @Input() id: string;
  @Input() imgThumbUrl: string;

  title: string;
  summary: string;

  constructor(private postLoader: PostLoaderService) { }

  ngOnInit() {
    this.postLoader.load(this.id, this.imgThumbUrl).then((post: Post) => {
      this.title = post.title;
      this.summary = post.summary;
    });
  }
}
