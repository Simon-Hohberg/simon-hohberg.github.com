import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as showdown from "../../../lib/showdown";
import * as Maxout from "../../../lib/maxout";
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, ParamMap } from '@angular/router';
declare var MathJax: any;

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @ViewChild('postInner') postInner: ElementRef;

  constructor(private http: HttpClient, private route: ActivatedRoute,) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let id: string = params.get('id');
      this.http.get('../../../assets/_posts/' + id + '.md', { responseType: 'text' }).subscribe(data => {
        showdown.setFlavor('github');
        showdown.setOption('tables', true);
        showdown.setOption('simpleLineBreaks', false);
        // showdown.setOption('literalMidWordUnderscores', true);
        let converter = new showdown.Converter();
        let html      = converter.makeHtml(data);
        this.postInner.nativeElement.innerHTML = html;
        if (id.indexOf('maxout') !== -1) {
          Maxout.net0();
          Maxout.net1();
        }
        MathJax.Hub.Typeset(this.postInner.nativeElement, undefined);
      });
    });
  }

}