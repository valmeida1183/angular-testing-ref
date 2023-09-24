describe("Home Page", () => {
	beforeEach(() => {
		// configura o mock de de courses através do fixtures/courses.json setando um alias
		cy.fixture("courses.json").as("coursesJSON");
		// inicializa o servidor de back end fake.
		cy.server();
		// configura que ao fazer um request nesta rota vai retornar como response o mock configurado
		// e setando um alias para o nome do Evento que vai ocorrer quando houver esta chamada.
		cy.route("/api/courses", "@coursesJSON").as("courses");

		cy.visit("/");
	});

	it("Shoul display a list of courses", () => {
		cy.contains("All Courses");
		// Espera o evento de request "courses" terminar.
		cy.wait("@courses");

		cy.get("mat-card").should("have.length", 9);
	});

	it("Shoul display the advanced courses", () => {
		cy.get(".mdc-tab").should("have.length", 2);

		cy.get(".mdc-tab").last().click();

		cy.get(".mat-mdc-tab-body-active .mat-mdc-card-title")
			.its("length")
			.should("be.gt", 1);

		cy.get(".mat-mdc-tab-body-active .mat-mdc-card-title")
			.first()
			.should("contain", "Angular Security Course");
	});
});
