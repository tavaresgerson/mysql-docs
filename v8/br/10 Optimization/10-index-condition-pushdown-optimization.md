#### 10.2.1.6 Otimização de Empurrão de Condição de Índice

O empurrão de condição de índice (ICP) é uma otimização para o caso em que o MySQL recupera linhas de uma tabela usando um índice. Sem ICP, o mecanismo de armazenamento percorre o índice para localizar as linhas na tabela base e devolvê-las ao servidor MySQL, que avalia a condição `WHERE` para as linhas. Com o ICP habilitado e se partes da condição `WHERE` puderem ser avaliadas usando apenas colunas do índice, o servidor MySQL empurra essa parte da condição `WHERE` para o mecanismo de armazenamento. O mecanismo de armazenamento então avalia a condição de índice empurrada usando a entrada do índice e, apenas se isso for satisfeito, a linha é lida da tabela. O ICP pode reduzir o número de vezes que o mecanismo de armazenamento precisa acessar a tabela base e o número de vezes que o servidor MySQL precisa acessar o mecanismo de armazenamento.

A aplicabilidade da otimização de empurrão de condição de índice está sujeita a estas condições:

* O ICP é usado para os métodos de acesso `range`, `ref`, `eq_ref` e `ref_or_null` quando é necessário acessar linhas completas da tabela.
* O ICP pode ser usado para tabelas `InnoDB` e `MyISAM`, incluindo tabelas `InnoDB` e `MyISAM` particionadas.
* Para tabelas `InnoDB`, o ICP é usado apenas para índices secundários. O objetivo do ICP é reduzir o número de leituras de linhas completas e, assim, reduzir as operações de E/S. Para índices agrupados `InnoDB`, o registro completo já é lido no buffer `InnoDB`. Usar o ICP nesse caso não reduz a E/S.
* O ICP não é suportado com índices secundários criados em colunas geradas virtualmente. O `InnoDB` suporta índices secundários em colunas geradas virtualmente.
* As condições que se referem a subconsultas não podem ser empurradas para baixo.
* As condições que se referem a funções armazenadas não podem ser empurradas para baixo. Os motores de armazenamento não podem invocar funções armazenadas.
* As condições disparadas não podem ser empurradas para baixo. (Para informações sobre condições disparadas, consulte a Seção 10.2.2.3, “Otimizando Subconsultas com a Estratégia EXISTS”.)
* As condições não podem ser empurradas para baixo para tabelas derivadas que contenham referências a variáveis de sistema.

Para entender como essa otimização funciona, considere primeiro como um varredura de índice ocorre quando o Empurrão de Condição de Índice não é usado:

1. Obtenha a próxima linha, primeiro lendo o tuplo do índice e, em seguida, usando o tuplo do índice para localizar e ler a linha completa da tabela.
2. Teste a parte da condição `WHERE` que se aplica a essa tabela. Aceite ou rejeite a linha com base no resultado da verificação.

Usando o Empurrão de Condição de Índice, a varredura ocorre da seguinte maneira:

1. Obtenha o tuplo de índice da próxima linha (mas não a linha completa da tabela).
2. Teste a parte da condição `WHERE` que se aplica a esta tabela e pode ser verificada usando apenas colunas de índice. Se a condição não for satisfeita, prossiga para o tuplo de índice da próxima linha.
3. Se a condição for satisfeita, use o tuplo de índice para localizar e ler a linha completa da tabela.
4. Teste a parte restante da condição `WHERE` que se aplica a esta tabela. Aceite ou rejeite a linha com base no resultado do teste.

A saída `EXPLAIN` mostra `Usando índice condição` na coluna `Extra` quando o Pushdown de Condição de Índice é usado. Não mostra `Usando índice` porque isso não se aplica quando as linhas completas da tabela devem ser lidas.

Suponha que uma tabela contenha informações sobre pessoas e seus endereços e que a tabela tenha um índice definido como `INDEX (zipcode, lastname, firstname)`. Se soubermos o valor do `zipcode` de uma pessoa, mas não tivermos certeza sobre o sobrenome, podemos pesquisar assim:

```
SELECT * FROM people
  WHERE zipcode='95054'
  AND lastname LIKE '%etrunia%'
  AND address LIKE '%Main Street%';
```

O MySQL pode usar o índice para percorrer pessoas com `zipcode='95054'`. A segunda parte (`lastname LIKE '%etrunia%'`) não pode ser usada para limitar o número de linhas que devem ser percorridas, então sem Pushdown de Condição de Índice, esta consulta deve recuperar linhas completas para todas as pessoas que têm `zipcode='95054'`.

Com Pushdown de Condição de Índice, o MySQL verifica a parte `lastname LIKE '%etrunia%'` antes de ler a linha completa da tabela. Isso evita ler linhas completas correspondentes aos tuplos de índice que correspondem à condição `zipcode`, mas não à condição `lastname`.

O Pushdown de Condição de Índice é ativado por padrão. Pode ser controlado com a variável de sistema `optimizer_switch` definindo o sinalizador `index_condition_pushdown`:

```
SET optimizer_switch = 'index_condition_pushdown=off';
SET optimizer_switch = 'index_condition_pushdown=on';
```

Veja a Seção 10.9.2, “Otimizações Switchables”.