const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando a listagem de perguntas vazias', () => {
  const questions = modelo.listar_perguntas();
  expect(questions.length).toBe(0);
});

test('Testando a busca por uma pergunta', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  
  const questions = modelo.listar_perguntas();

  const firstQuestion = modelo.get_pergunta(questions[0].id_pergunta);
  const secondQuestion = modelo.get_pergunta(questions[1].id_pergunta);

  expect(firstQuestion).toBeTruthy();
  expect(secondQuestion).toBeTruthy();
  expect(firstQuestion.texto).toBe('1 + 1 = ?');
  expect(secondQuestion.texto).toBe('2 + 2 = ?');
});

test('Testando a busca por uma pergunta que não existe', () => {
  const question = modelo.get_pergunta(3141592);
  expect(question).toBeUndefined();
});

test('Testando o cadastro de uma resposta', () => {
  modelo.cadastrar_pergunta('Jest é o único framework de testes JS?');
  const questions = modelo.listar_perguntas();
  
  modelo.cadastrar_resposta(questions[0].id_pergunta, 'Não, existem outros frameworks como o Vitest, por exemplo.');

  const answers = modelo.get_respostas(questions[0].id_pergunta);

  expect(answers.length).toBe(1);
  expect(answers[0].texto).toBe('Não, existem outros frameworks como o Vitest, por exemplo.')
});

test('Testando a listagem de respostas vazias', () => {
  modelo.cadastrar_pergunta('Jest é o único framework de testes JS?');
  
  const questions = modelo.listar_perguntas();
  const answers = modelo.get_respostas(questions[0].id_pergunta);
  
  expect(answers.length).toBe(0);
});

test('Testando a listagem de respostas', () => {
  modelo.cadastrar_pergunta('Jest é o único framework de testes JS?');
  modelo.cadastrar_pergunta('Para que serve o Cypress?');
  
  const questions = modelo.listar_perguntas();
  
  modelo.cadastrar_resposta(questions[0].id_pergunta, 'Provavelmente não, mas também não conheço outros.');
  
  modelo.cadastrar_resposta(questions[1].id_pergunta, 'É uma ferramenta para realizar testes E2E.');
  modelo.cadastrar_resposta(questions[1].id_pergunta, 'Segue o link da documentação da ferramenta: https://www.cypress.io/');

  const firstQuestionAnswers = modelo.get_respostas(questions[0].id_pergunta);
  const secondQuestionAnswers = modelo.get_respostas(questions[1].id_pergunta);

  expect(firstQuestionAnswers.length).toBe(1);
  expect(secondQuestionAnswers.length).toBe(2);
});

test('Testando o retorno do número de respostas', () => {
  modelo.cadastrar_pergunta('Para que serve o Cypress?');

  const questions = modelo.listar_perguntas();
  
  modelo.cadastrar_resposta(questions[0].id_pergunta, 'É uma ferramenta para realizar testes E2E.');
  modelo.cadastrar_resposta(questions[0].id_pergunta, 'Segue o link da documentação da ferramenta: https://www.cypress.io/');
  modelo.cadastrar_resposta(questions[0].id_pergunta, 'Também não sei amigo.');

  const questionAnswersCount = modelo.get_num_respostas(questions[0].id_pergunta);

  expect(questionAnswersCount).toBe(3);
});
