### 23.4.3 Sintaxe de eventos

O MySQL oferece várias instruções SQL para trabalhar com eventos agendados:

- Novos eventos são definidos usando a instrução `CREATE EVENT`. Veja a Seção 13.1.12, “Instrução CREATE EVENT”.

- A definição de um evento existente pode ser alterada por meio da instrução `ALTER EVENT`. Veja a Seção 13.1.2, “Instrução ALTER EVENT”.

- Quando um evento agendado não é mais desejado ou necessário, ele pode ser excluído do servidor pelo seu definidor usando a instrução `DROP EVENT`. Veja a Seção 13.1.23, “Instrução DROP EVENT”. Se um evento persistir após o término de sua programação, isso também depende de sua cláusula `ON COMPLETION`, se houver. Veja a Seção 13.1.12, “Instrução CREATE EVENT”.

  Um evento pode ser excluído por qualquer usuário que tenha o privilégio `EVENT` para o banco de dados no qual o evento está definido. Veja a Seção 23.4.6, “O Agendamento de Eventos e os Privilégios do MySQL”.
