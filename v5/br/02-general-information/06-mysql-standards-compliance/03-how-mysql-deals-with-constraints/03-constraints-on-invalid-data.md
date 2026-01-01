#### 1.6.3.3 Restrições para dados inválidos

O MySQL 5.7.5 e versões posteriores usam o modo SQL estrito por padrão, que trata valores inválidos de forma que o servidor os rejeita e interrompe a instrução na qual ocorrem (veja a Seção 5.1.10, “Modos SQL do Servidor”). Anteriormente, o MySQL era muito mais indulgente com valores incorretos usados na entrada de dados; isso agora exige a desativação do modo estrito, o que não é recomendado. O restante desta seção discute o comportamento antigo seguido pelo MySQL quando o modo estrito foi desativado.

Se você não estiver usando o modo estrito, sempre que você inserir um valor “incorreto” em uma coluna, como um `NULL` em uma coluna `NOT NULL` ou um valor numérico muito grande em uma coluna numérica, o MySQL define a coluna como o “melhor valor possível” em vez de gerar um erro: As seguintes regras descrevem mais detalhadamente como isso funciona:

- Se você tentar armazenar um valor fora do intervalo em uma coluna numérica, o MySQL Server armazena zero, o menor valor possível, ou o maior valor possível, dependendo do que estiver mais próximo do valor inválido.

- Para cadeias de caracteres, o MySQL armazena ou a cadeia de caracteres vazia ou o máximo da cadeia de caracteres que pode ser armazenado na coluna.

- Se você tentar armazenar uma string que não começa com um número em uma coluna numérica, o MySQL Server armazena 0.

- Os valores inválidos para as colunas `ENUM` e `SET` são tratados conforme descrito na Seção 1.6.3.4, “Restrições `ENUM` e `SET`”.

- O MySQL permite que você armazene certos valores de data incorretos nas colunas `DATE` e `DATETIME` (como `'2000-02-31'` ou `'2000-02-00'`). Nesse caso, quando uma aplicação não habilitou o modo SQL rigoroso, cabe à aplicação validar as datas antes de armazená-las. Se o MySQL puder armazenar um valor de data e recuperar exatamente o mesmo valor, ele o armazena como dado. Se a data estiver totalmente errada (fora da capacidade do servidor de armazená-la), o valor especial de data `'0000-00-00'` é armazenado na coluna.

- Se você tentar armazenar `NULL` em uma coluna que não aceita valores `NULL`, um erro ocorrerá para instruções de inserção de uma única linha. Para instruções de inserção de várias linhas ou para instruções de inserção em ... SELECT, o MySQL Server armazena o valor padrão implícito para o tipo de dados da coluna. Geralmente, este é `0` para tipos numéricos, a string vazia (`''`) para tipos de string e o valor "zero" para tipos de data e hora. Os valores padrão implícitos são discutidos na Seção 11.6, "Valores padrão de tipo de dados".

- Se uma instrução `INSERT` não especificar nenhum valor para uma coluna, o MySQL insere seu valor padrão se a definição da coluna incluir uma cláusula `DEFAULT` explícita. Se a definição não tiver tal cláusula `DEFAULT`, o MySQL insere o valor padrão implícito para o tipo de dados da coluna.

A razão para usar as regras anteriores quando o modo estrito não está em vigor é que não podemos verificar essas condições até que a instrução tenha começado a ser executada. Não podemos simplesmente reverter se encontrarmos um problema após atualizar algumas linhas, porque o mecanismo de armazenamento pode não suportar o rollback. A opção de encerrar a instrução não é muito boa; nesse caso, a atualização estaria "metade feita", o que é provavelmente o pior cenário possível. Nesse caso, é melhor "fazer o melhor que você pode" e, em seguida, continuar como se nada tivesse acontecido.

Você pode selecionar um tratamento mais rigoroso dos valores de entrada usando os modos SQL `STRICT_TRANS_TABLES` ou `STRICT_ALL_TABLES`:

```sql
SET sql_mode = 'STRICT_TRANS_TABLES';
SET sql_mode = 'STRICT_ALL_TABLES';
```

`STRICT_TRANS_TABLES` habilita o modo estrito para os motores de armazenamento transacional e, em certa medida, para os motores não transacionais. Funciona da seguinte forma:

- Para os motores de armazenamento transacionais, valores de dados inválidos que ocorram em qualquer parte de uma declaração fazem com que a declaração seja interrompida e revertida.

- Para motores de armazenamento não transacionais, uma declaração é interrompida se o erro ocorrer na primeira linha a ser inserida ou atualizada. (Quando o erro ocorre na primeira linha, a declaração pode ser interrompida para deixar a tabela inalterada, assim como para uma tabela transacional.) Erros em linhas após a primeira não interrompem a declaração, porque a tabela já foi alterada pela primeira linha. Em vez disso, valores de dados incorretos são ajustados e resultam em avisos em vez de erros. Em outras palavras, com `STRICT_TRANS_TABLES`, um valor errado faz com que o MySQL desfaça todas as atualizações feitas até então, se isso puder ser feito sem alterar a tabela. Mas, uma vez que a tabela foi alterada, erros adicionais resultam em ajustes e avisos.

Para uma verificação ainda mais rigorosa, habilite `STRICT_ALL_TABLES`. Isso é o mesmo que `STRICT_TRANS_TABLES`, exceto que, para os motores de armazenamento não transacionais, os erros abortam a instrução mesmo para dados ruins nas linhas seguintes à primeira linha. Isso significa que, se um erro ocorrer no meio de uma inserção ou atualização de várias linhas para uma tabela não transacional, um update parcial será gerado. As linhas anteriores serão inseridas ou atualizadas, mas as que estão no ponto do erro não serão. Para evitar isso em tabelas não transacionais, use instruções de uma única linha ou, caso os avisos de conversão sejam aceitáveis em vez de erros, use `STRICT_TRANS_TABLES`. Para evitar problemas desde o início, não use o MySQL para verificar o conteúdo das colunas. É mais seguro (e muitas vezes mais rápido) deixar que o aplicativo garanta que ele envie apenas valores válidos para o banco de dados.

Com qualquer uma das opções de modo rigoroso, você pode fazer com que os erros sejam tratados como avisos usando `INSERT IGNORE` ou `UPDATE IGNORE` em vez de `INSERT` ou `UPDATE` sem `IGNORE`.
