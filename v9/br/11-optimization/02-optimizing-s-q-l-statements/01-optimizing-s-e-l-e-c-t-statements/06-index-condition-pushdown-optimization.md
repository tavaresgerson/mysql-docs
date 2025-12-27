#### 10.2.1.6 Otimização de Empurrão de Condição de Índice

O Empurrão de Condição de Índice (ICP) é uma otimização para o caso em que o MySQL recupera linhas de uma tabela usando um índice. Sem ICP, o mecanismo de armazenamento percorre o índice para localizar as linhas na tabela base e retorna-as ao servidor MySQL, que avalia a condição `WHERE` para as linhas. Com o ICP habilitado e se partes da condição `WHERE` puderem ser avaliadas usando apenas colunas do índice, o servidor MySQL empurra essa parte da condição `WHERE` para o mecanismo de armazenamento. O mecanismo de armazenamento então avalia a condição de índice empurrada usando a entrada do índice e, apenas se isso for satisfeito, a linha é lida da tabela. O ICP pode reduzir o número de vezes que o mecanismo de armazenamento precisa acessar a tabela base e o número de vezes que o servidor MySQL precisa acessar o mecanismo de armazenamento.

A aplicabilidade da otimização de Empurrão de Condição de Índice está sujeita a estas condições:

* O ICP é usado para os métodos de acesso `range`, `ref`, `eq_ref` e `ref_or_null` quando há a necessidade de acessar linhas completas da tabela.

* O ICP pode ser usado para tabelas `InnoDB` e `MyISAM`, incluindo tabelas `InnoDB` e `MyISAM` particionadas.

* Para tabelas `InnoDB`, o ICP é usado apenas para índices secundários. O objetivo do ICP é reduzir o número de leituras de linhas completas e, assim, reduzir as operações de I/O. Para índices agrupados `InnoDB`, o registro completo já é lido no buffer `InnoDB`. Usar ICP neste caso não reduz o I/O.

* O ICP não é suportado com índices secundários criados em colunas geradas virtualmente. O `InnoDB` suporta índices secundários em colunas geradas virtualmente.

* Condições que se referem a subconsultas não podem ser empurradas para baixo.

* Condições que se referem a funções armazenadas não podem ser empurradas para baixo. Os mecanismos de armazenamento não podem invocar funções armazenadas.

* As condições desencadeadas não podem ser empurradas para baixo. (Para informações sobre condições desencadeadas, consulte a Seção 10.2.2.3, “Otimização de subconsultas com a estratégia EXISTS”.)

* As condições não podem ser empurradas para baixo para tabelas derivadas que contenham referências a variáveis do sistema.

Para entender como essa otimização funciona, considere primeiro como uma varredura de índice ocorre quando o Empurrar Condições de Índice não é usado:

1. Obtenha a próxima linha, primeiro lendo o tuplo do índice e, em seguida, usando o tuplo do índice para localizar e ler a linha completa da tabela.

2. Teste a parte da condição `WHERE` que se aplica a essa tabela. Aceite ou rejeite a linha com base no resultado do teste.

Usando o Empurrar Condições de Índice, a varredura ocorre da seguinte maneira:

1. Obtenha o tuplo do índice da próxima linha (mas não a linha completa da tabela).

2. Teste a parte da condição `WHERE` que se aplica a essa tabela e pode ser verificada usando apenas colunas de índice. Se a condição não for satisfeita, prossiga para o tuplo do índice da próxima linha.

3. Se a condição for satisfeita, use o tuplo do índice para localizar e ler a linha completa da tabela.

4. Teste a parte restante da condição `WHERE` que se aplica a essa tabela. Aceite ou rejeite a linha com base no resultado do teste.

A saída do `EXPLAIN` mostra `Usando condição de índice` na coluna `Extra` quando o Empurrar Condições de Índice é usado. Não mostra `Usando índice` porque isso não se aplica quando as linhas completas da tabela devem ser lidas.

Suponha que uma tabela contenha informações sobre pessoas e seus endereços e que a tabela tenha um índice definido como `INDEX (zipcode, lastname, firstname)`. Se soubermos o valor do `zipcode` de uma pessoa, mas não tivermos certeza sobre o sobrenome, podemos pesquisar da seguinte maneira:

```
SELECT * FROM people
  WHERE zipcode='95054'
  AND lastname LIKE '%etrunia%'
  AND address LIKE '%Main Street%';
```

O MySQL pode usar o índice para percorrer pessoas com `zipcode='95054'`. A segunda parte (`lastname LIKE '%etrunia%'`) não pode ser usada para limitar o número de linhas que devem ser percorridas, então, sem o empurrão de condição de índice, essa consulta deve recuperar linhas completas da tabela para todas as pessoas que têm `zipcode='95054'`.

Com o empurrão de condição de índice, o MySQL verifica a parte `lastname LIKE '%etrunia%'` antes de ler a linha completa da tabela. Isso evita a leitura de linhas completas correspondentes a tuplas de índice que correspondem à condição `zipcode`, mas não à condição `lastname`.

O empurrão de condição de índice está habilitado por padrão. Ele pode ser controlado com a variável de sistema `optimizer_switch` definindo o sinalizador `index_condition_pushdown`:

```
SET optimizer_switch = 'index_condition_pushdown=off';
SET optimizer_switch = 'index_condition_pushdown=on';
```

Veja a Seção 10.9.2, “Otimizações com opção de ativação”.