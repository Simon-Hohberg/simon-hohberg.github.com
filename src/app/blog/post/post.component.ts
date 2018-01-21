import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as showdown from "../../../lib/showdown";
import * as Maxout from "../../../lib/maxout";
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PostLoaderService } from '../../post-loader.service';
declare var MathJax: any;

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @ViewChild('postInner') postInner: ElementRef;

  constructor(private postLoader: PostLoaderService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let id: string = params.get('id');
      let path = "_posts";
      this.postLoader.load(path + "/" + id).then((post) => {
        this.postInner.nativeElement.innerHTML = post.content;
      });
    });
  }

}