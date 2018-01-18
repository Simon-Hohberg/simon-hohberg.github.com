import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as showdown from "../lib/showdown";
import { Post } from "./post";

@Injectable()
export class PostLoaderService {

  readonly postRegex: RegExp = /\-+\n((?:(?:title|layout|thumbImg|keywords|thumbColor)\:\s*.+\n)+)\-+\n\n\#\s*(.+)\n\n((?:.+\n)+)\n((?:.+\n*)+)/;
  readonly metaInfoRegex: RegExp = /^(title|layout|thumbImg|keywords|thumbColor)\:\s*(.+)$/gm;
  readonly idRegex: RegExp = /(\d\d\d\d)-(\d\d)-(\d\d)-.+/;

  private cache: Map<string, Post> = new Map<string, Post>();

  constructor(private http: HttpClient) { }

  load(id: string): Promise<Post> {
    return new Promise<Post>((resolve, reject) => {
        if (this.cache.has(id)) {
          resolve(this.cache.get(id));
          return;
        }
        this.http.get('./assets/_posts/' + id + '.md', { responseType: 'text' }).subscribe(data => {
          let idParts = this.idRegex.exec(id);
          let postDate = new Date();
          postDate.setFullYear(parseInt(idParts[1]));
          postDate.setMonth(parseInt(idParts[2]));
          postDate.setMonth(parseInt(idParts[3]));
          let postParts: RegExpExecArray = this.postRegex.exec(data);
          let title: string = postParts[2]
          let summary: string = postParts[3];
          let content: string = postParts[4];
          
          let post = new Post();
          post.title = title;
          post.date = postDate;

          let metaInfo: RegExpExecArray;
          while ((metaInfo = this.metaInfoRegex.exec(postParts[1])) !== null) {

            // Catch zero width matches
            if (metaInfo.index === this.metaInfoRegex.lastIndex) {
              this.metaInfoRegex.lastIndex++;
            }

            let metaKey: string = metaInfo[1];
            let metaValue: string = metaInfo[2];
            switch (metaKey) {
              case "title":
                post.title = metaValue;
                break;
              case "layout":
                post.layout = metaValue;
                break;
              case "thumbImg":
                post.imgThumbUrl = metaValue;
                break;
              case "keywords":
                post.keywords = metaValue.split(',').map((k) => { return k.startsWith(' ') ? k.slice(1) : k });
                break;
              case "thumbColor":
                post.thumbColor = metaValue;
                break;
              default:
                console.warn("Unknown meta info " + metaKey + ": " + metaValue);
                break;
            }
          }
    
          showdown.setFlavor('github');
          showdown.setOption('tables', true);
          showdown.setOption('simpleLineBreaks', false);
          let converter = new showdown.Converter();
          let htmlContent = converter.makeHtml(content);
          post.content = htmlContent;
          let htmlSummary = converter.makeHtml(summary);
          post.summary = htmlSummary;
          this.cache.set(id, post);
          resolve(post);
          // this.postInner.nativeElement.innerHTML = html;
          // if (id.indexOf('maxout') !== -1) {
          //   Maxout.net0();
          //   Maxout.net1();
          // }
          // MathJax.Hub.Typeset(this.postInner.nativeElement, undefined);
      });
    });
  }
}
