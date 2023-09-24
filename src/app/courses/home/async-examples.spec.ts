import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

describe("Async Testing Examples for native asynchronous calls, like setTimeout, http requests using fetch api...", () => {
  // Essa abordagem deve ser evitada, pois utilizar o setTimeout para simular funcionalidades async
  // Este é um exemplo utilizando o DoneFn do jasmine, que indica manualmente quando a execução terminou.
  it("Async test example with Jasmine done()", (done: DoneFn) => {
    let test = false;

    setTimeout(() => {
      console.log("running assertions");

      test = true;

      expect(test).toBeTruthy();
      done();
    }, 1000);
  });

  // Exemplo utilizando o fakeAsync, que encapsula a função do teste em uma zona assíncrona (internamente usando zone.js).
  it("Async test example -setTimeout()", fakeAsync(() => {
    let test = false;

    setTimeout(() => {
      console.log("running assertions fakeAsync()");
      test = true;
    }, 1000);

    // Tick é uam função que só pode ser executada dentro do corpo de fakeAsync e ela serve para controlar manualmente a passagem do tempo.
    // Neste exemplo estou forçando a passagem de 1s que é exatamente o tempo necessário para o setTimout terminar.
    tick(1000);
    expect(test).toBeTruthy();
  }));

  // Exemplo utilizando o fakeAsync, mas com multiplas requisições async.
  it("Async test example multiple -setTimeout()", fakeAsync(() => {
    let test = false;
    let test2 = false;

    setTimeout(() => {
      console.log("running assertions 1 inside fakeAsync()");
      test = true;
    }, 1000);

    setTimeout(() => {
      console.log("running assertions 2 inside fakeAsync()");
      test2 = true;
    }, 1000);

    // Flush vai esperar todos os métodos async terminarem. Tornando o fluxo muito semelhanto ao síncrono.
    flush();
    expect(test).toBeTruthy();
    expect(test2).toBeTruthy();
  }));
});

// Este exemplo mostra que promisses são microtasks ao contrário de tasks (setTimout, setInterval http requests, mouse event clicks, etc...)
// e tem uma fila de execução separada no browser, como resultado disso nos logs elas sempre executam primeiro
describe("Async Testing Examples for Promises", () => {
  it("Async test example - plain Promise (promise is a microtask)", fakeAsync(() => {
    let test = false;

    console.log("Creating promise");

    // setTimeout(() => {
    //   // add this to task execution queue
    //   console.log("seTimeout first callback triggered");
    // });

    // setTimeout(() => {
    //   // add this to task execution queue
    //   console.log("seTimeout second callback triggered");
    // });

    Promise.resolve().then(() => {
      // add this to microtask execution queue
      console.log("Promise first then() evaluated successfully");
      return Promise.resolve().then(() => {
        // add this to microtask execution queue
        console.log("Promise second then() evaluated successfully");
        test = true;
      });
    });

    flushMicrotasks(); // espera a execução de todos os métodos na fila de microtasks
    console.log("running assertions for Promise");
    expect(test).toBeTruthy();

    // Depois de executar este último trecho de código o
    // browser vai executar tudo que estiver na fila de microtasks e somente depois o que estiver na fila de tasks
    // por isso a chamada do flushMicrotasks é necessária para fazer o teste passar.
  }));

  it("Async test example - Promises + setTimeout()", fakeAsync(() => {
    let counter = 0;

    Promise.resolve().then(() => {
      counter += 10;

      setTimeout(() => {
        counter += 1;
      }, 1000);
    });

    expect(counter).toBe(0);

    flushMicrotasks();

    expect(counter).toBe(10);

    tick(500);

    expect(counter).toBe(10);

    tick(500);

    expect(counter).toBe(11);
  }));
});

// Este exemplo mostra os testes com Observables
describe("Async Testing Examples for Observables", () => {
  it("Async test example - plain Observavle", fakeAsync(() => {
    let test = false;

    console.log("Creating Observable");

    const test$ = of(test).pipe(delay(1000)); // sem deo delay o observable se torna síncrono e é resolvido imediatamente neste cenário de criação com "of"

    test$.subscribe(() => {
      test = true;
    });

    tick(1000);

    console.log("Running test assertions");

    expect(test).toBe(true);
  }));
});
