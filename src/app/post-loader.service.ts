import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as showdown from "../lib/showdown";
import { Post } from "./post";

@Injectable()
export class PostLoaderService {

  readonly postRegex: RegExp = /\-+\n((?:(?:title|layout)\:\s*.+\n)+)\-+\n\n((?:.+\n)+)/;
  readonly metaInfoRegex: RegExp = /^(title|layout|test)\:\s*(.+)$/gm;

  private cache: Map<string, Post> = new Map<string, Post>();

  constructor(private http: HttpClient) { }

  load(id: string, imgThumbUrl?: string): Promise<Post> {
    return new Promise<Post>((resolve, reject) => {
        if (this.cache.has(id)) {
          resolve(this.cache.get(id));
          return;
        }
        resolve(null);
      //   this.http.get('./assets/_posts/' + id + '.md', { responseType: 'text' }).subscribe(data => {
      //     let postParts: RegExpExecArray =  this.postRegex.exec(data);
      //     let metaInfo: string = postParts[1];
      //     let metaParts: RegExpExecArray = this.metaInfoRegex.exec(metaInfo);
      //     let content: string = postParts[2];
          
      //     let post = new Post();
      //     post.imgThumbUrl = imgThumbUrl;

      //     for (let i = 1; i < metaParts.length; i+2) {
      //       let metaKey: string = metaParts[i];
      //       let metaValue: string = metaParts[i+1];
      //       switch (metaKey) {
      //         case "title":
      //           post.title = metaValue;
      //           break;
      //         case "layout":
      //           post.layout = metaValue;
      //           break;
      //         default:
      //           console.warn("Unknown meta info " + metaKey + ": " + metaValue);
      //           break;
      //       }
      //     }
    
      //     showdown.setFlavor('github');
      //     showdown.setOption('tables', true);
      //     showdown.setOption('simpleLineBreaks', false);
      //     let converter = new showdown.Converter();
      //     let htmlContent = converter.makeHtml(content);
      //     post.content = htmlContent;
      //     this.cache.set(id, post);
      //     resolve(post);
      //     // this.postInner.nativeElement.innerHTML = html;
      //     // if (id.indexOf('maxout') !== -1) {
      //     //   Maxout.net0();
      //     //   Maxout.net1();
      //     // }
      //     // MathJax.Hub.Typeset(this.postInner.nativeElement, undefined);
      // });
    });
  }
}
