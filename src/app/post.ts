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

    get title(): string {
        return this._title;
    }

    set summary(summary: string) {
        this._summary = summary;
    }

    get summary(): string {
        return this._summary;
    }

    set imgThumbUrl(imgThumbUrl: string) {
        this._imgThumbUrl = imgThumbUrl;
    }

    get imgThumbUrl(): string {
        return this._imgThumbUrl;
    }

    set content(content: string) {
        this._content = content;
    }

    get content(): string {
        return this._content;
    }

    set layout(layout: string) {
        this._layout = layout;
    }

    get layout(): string {
        return this._layout;
    }
}
