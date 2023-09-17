import {
  async,
  ComponentFixture,
  fakeAsync,
  flush,
  flushMicrotasks,
  TestBed,
  waitForAsync,
} from "@angular/core/testing";
import { CoursesModule } from "../courses.module";
import { DebugElement } from "@angular/core";

import { HomeComponent } from "./home.component";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { CoursesService } from "../services/courses.service";
import { HttpClient } from "@angular/common/http";
import { COURSES } from "../../../../server/db-data";
import { setupCourses } from "../common/setup-test-data";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { click } from "../common/test-utils";

describe("HomeComponent", () => {
  let fixture: ComponentFixture<HomeComponent>;
  let homeComponent: HomeComponent;
  let debugElemen: DebugElement;
  let coursesService: any;

  const beginnerCourses = setupCourses().filter(
    (course) => course.category === "BEGINNER"
  );
  const advancedCourses = setupCourses().filter(
    (course) => course.category === "ADVANCED"
  );

  beforeEach(waitForAsync(() => {
    const coursesServiceSpy = jasmine.createSpyObj("CourseService", [
      "findAllCourses",
    ]);

    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule, // este é um modulo que deve ser usado nos testes para desconsiderar as animações
      ],
      providers: [{ provide: CoursesService, useValue: coursesServiceSpy }],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        homeComponent = fixture.componentInstance;
        debugElemen = fixture.debugElement;
        coursesService = TestBed.inject(CoursesService);
      });
  }));

  it("should create the component", () => {
    expect(homeComponent).toBeTruthy();
  });

  it("should display only beginner courses", () => {
    // Mockando o retorno do método "findAllCourses" do serviço coursesService, para teronar somente courses da category Beginner
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));

    //Dispara o mecanismo de changeDetection do angular para atualizar a view.
    fixture.detectChanges();

    //Busca no HTML da view renderizada os elementos "header" das tabs (que contém o nome da tab)
    const tabs = debugElemen.queryAll(By.css(".mat-mdc-tab"));

    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
  });

  it("should display only advanced courses", () => {
    // Mockando o retorno do método "findAllCourses" do serviço coursesService, para teronar somente courses da category Advanced
    coursesService.findAllCourses.and.returnValue(of(advancedCourses));

    //Dispara o mecanismo de changeDetection do angular para atualizar a view.
    fixture.detectChanges();

    //Busca no HTML da view renderizada os elementos "header" das tabs (que contém o nome da tab)
    const tabs = debugElemen.queryAll(By.css(".mat-mdc-tab"));

    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
  });

  it("should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = debugElemen.queryAll(By.css(".mat-mdc-tab"));

    expect(tabs.length).toBe(2, "Expect to find 2 tabs only");
  });

  it("should display advanced courses when tab clicked", () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = debugElemen.queryAll(By.css(".mat-mdc-tab"));

    click(tabs[1]);

    const carTitles = debugElemen.queryAll(By.css(".mat-mdc-card-title"));

    expect(carTitles.length).toBeGreaterThan(0, "Could not find card titles");
    expect(carTitles[0].nativeElement.textContent).toContain(
      "Angular Security Course"
    );
  });
});
