export class Post {

    private _title: string;
    private _summary: string;
    private _imgThumbUrl: string;
    private _content: string;
    private _layout: string;

    constructor(title?: string, summary?: string, imgThumbUrl?: string, content?: string, layout?: string) {
        this._title = title;
        this._summary = summary;
        this._imgThumbUrl = imgThumbUrl;
        this._content = content;
        this._layout = layout;
    }

    set title(title: string) {
        this._title = title;
    }

    set summary(summary: string) {
        this._summary = summary;
    }

    set imgThumbUrl(imgThumbUrl: string) {
        this._imgThumbUrl = imgThumbUrl;
    }

    set content(content: string) {
        this._content = content;
    }

    set layout(layout: string) {
        this._layout = layout;
    }
}
