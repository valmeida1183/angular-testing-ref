import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CoursesCardListComponent } from "./courses-card-list.component";
import { CoursesModule } from "../courses.module";
import { COURSES } from "../../../../server/db-data";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { sortCoursesBySeqNo } from "../home/sort-course-by-seq";
import { Course } from "../model/course";
import { setupCourses } from "../common/setup-test-data";

// Teste de um componente de apresentação:
describe("CoursesCardListComponent", () => {
  let coursesCardListComponent: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>; // é um helper que ajuda a testar, instanciar, debuggar componentes
  let debugElemen: DebugElement;

  beforeEach(waitForAsync(() => {
    // TestBed.configureTestingModule({declarations: [
    //   // todos os componentes que este componente usa...
    // ]});

    // Contudo em vez de declarar cada componente um por um, melhor é importar os módulos que contém os componentes dependentes
    TestBed.configureTestingModule({
      imports: [CoursesModule],
    })
      .compileComponents() // é preciso compilar os componentes antes que o TestBed possa instanciar um componente
      .then(() => {
        fixture = TestBed.createComponent(CoursesCardListComponent);
        coursesCardListComponent = fixture.componentInstance;
        debugElemen = fixture.debugElement;
      });
  }));

  it("should create the component", () => {
    expect(coursesCardListComponent).toBeTruthy();
  });

  it("should display the course list", () => {
    // atribuir os dados ao componente
    coursesCardListComponent.courses = setupCourses();

    // é necessário disparar manualmente o mecanismo de changeDetection do angular
    fixture.detectChanges();

    // Busca os componentes de Cards no DOM pela classe CSS
    const cards = debugElemen.queryAll(By.css(".course-card"));

    expect(cards).toBeTruthy("Could not find cards");
    expect(cards.length).toBe(12, "Unexpected number of courses");
  });

  it("should display the first course", () => {
    coursesCardListComponent.courses = setupCourses();
    fixture.detectChanges();

    const course = coursesCardListComponent.courses[0];
    const card = debugElemen.query(By.css(".course-card:first-child")),
      title = card.query(By.css("mat-card-title")),
      image = card.query(By.css("img"));

    expect(card).toBeTruthy("Could not find course card");
    expect(title.nativeElement.textContent).toBe(course.titles.description);
    expect(image.nativeElement.src).toBe(course.iconUrl);
  });
});
