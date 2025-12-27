### 27.5.3 Sintaxe de Eventos

O MySQL fornece várias instruções SQL para trabalhar com eventos agendados:

* Novos eventos são definidos usando a instrução `CREATE EVENT`. Veja a Seção 15.1.15, “Instrução CREATE EVENT”.

* A definição de um evento existente pode ser alterada por meio da instrução `ALTER EVENT`. Veja a Seção 15.1.3, “Instrução ALTER EVENT”.

* Quando um evento agendado não é mais desejado ou necessário, ele pode ser excluído do servidor pelo seu definidor usando a instrução `DROP EVENT`. Veja a Seção 15.1.29, “Instrução DROP EVENT”. Se um evento persistir após o término de sua programação também depende de sua cláusula `ON COMPLETION`, se tiver uma. Veja a Seção 15.1.15, “Instrução CREATE EVENT”.

* Um evento pode ser excluído por qualquer usuário que tenha o privilégio `EVENT` para o banco de dados no qual o evento é definido. Veja a Seção 27.5.6, “O Agendamento de Eventos e Privilégios MySQL”.