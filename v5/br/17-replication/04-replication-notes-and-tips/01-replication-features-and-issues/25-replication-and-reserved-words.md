#### 16.4.1.25 Replicação e Palavras Reservadas

Você pode encontrar problemas ao tentar replicar de uma fonte mais antiga para uma réplica mais recente e usar identificadores na fonte que são palavras reservadas na versão mais recente do MySQL que está sendo executada na réplica. Um exemplo disso é usar uma coluna de tabela chamada `virtual` em uma fonte 5.6 que está replicando para uma réplica 5.7 ou superior, porque `VIRTUAL` é uma palavra reservada a partir do MySQL 5.7. A replicação pode falhar nesses casos com o erro 1064 Você tem um erro na sintaxe do SQL..., *mesmo que um banco de dados ou tabela nomeados usando a palavra reservada ou uma tabela com uma coluna nomeada usando a palavra reservada sejam excluídos da replicação*. Isso ocorre porque cada evento SQL deve ser analisado pela réplica antes da execução, para que a réplica saiba quais objetos ou objetos do banco de dados seriam afetados; apenas após o evento ser analisado, a réplica pode aplicar quaisquer regras de filtragem definidas por `--replicate-do-db`, `--replicate-do-table`, `--replicate-ignore-db` e `--replicate-ignore-table`.

Para contornar o problema de nomes de banco de dados, tabelas ou colunas na fonte que seriam considerados palavras reservadas pela replica, faça um dos seguintes:

- Use uma ou mais instruções `ALTER TABLE` na fonte para alterar os nomes de quaisquer objetos do banco de dados onde esses nomes seriam considerados palavras reservadas na replica, e altere quaisquer instruções SQL que usem os nomes antigos para usar os novos nomes.

- Em qualquer declaração SQL que utilize esses nomes de objetos do banco de dados, escreva os nomes como identificadores com aspas usando caracteres de barra invertida (\`\`\`).

Para ver a lista de palavras reservadas por versão do MySQL, consulte Palavras-chave e Palavras Reservadas no MySQL 5.7, no *Referência de Versão do MySQL Server*. Para regras de citação de identificadores, consulte Seção 9.2, “Nomes de Objetos de Esquema”.
