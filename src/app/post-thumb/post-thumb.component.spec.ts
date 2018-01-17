import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostThumbComponent } from './post-thumb.component';

describe('PostThumbComponent', () => {
  let component: PostThumbComponent;
  let fixture: ComponentFixture<PostThumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostThumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostThumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
