import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PageQueueComponent } from "./page-queue.component";

describe("PageQueueComponent", () => {
  let component: PageQueueComponent;
  let fixture: ComponentFixture<PageQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageQueueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
