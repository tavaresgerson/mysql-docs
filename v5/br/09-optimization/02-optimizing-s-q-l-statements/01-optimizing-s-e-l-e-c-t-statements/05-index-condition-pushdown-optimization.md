#### 8.2.1.5 Otimização da empilhamento da condição do índice

O Índice de Condição de Empurrão (ICP) é uma otimização para o caso em que o MySQL recupera linhas de uma tabela usando um índice. Sem ICP, o mecanismo de armazenamento percorre o índice para localizar as linhas na tabela base e as retorna ao servidor MySQL, que avalia a condição `WHERE` para as linhas. Com ICP habilitado e se partes da condição `WHERE` puderem ser avaliadas usando apenas colunas do índice, o servidor MySQL empurra essa parte da condição `WHERE` para o mecanismo de armazenamento. O mecanismo de armazenamento então avalia a condição de índice empurrada usando a entrada do índice e, apenas se isso for satisfeito, a linha é lida da tabela. O ICP pode reduzir o número de vezes que o mecanismo de armazenamento precisa acessar a tabela base e o número de vezes que o servidor MySQL precisa acessar o mecanismo de armazenamento.

A aplicação da otimização por empilhamento da condição do índice está sujeita a estas condições:

- O ICP é usado para os métodos de acesso `range`, `ref`, `eq_ref` e `ref_or_null` quando é necessário acessar linhas inteiras da tabela.

- O ICP pode ser usado para tabelas `InnoDB` e `MyISAM`, incluindo tabelas `InnoDB` e `MyISAM` particionadas.

- Para as tabelas `InnoDB`, o ICP é usado apenas para índices secundários. O objetivo do ICP é reduzir o número de leituras completas de linhas e, assim, reduzir as operações de E/S. Para índices agrupados `InnoDB`, o registro completo já é lido no buffer `InnoDB`. Usar o ICP nesse caso não reduz o E/S.

- O ICP não é suportado com índices secundários criados em colunas geradas virtualmente. O `InnoDB` suporta índices secundários em colunas geradas virtualmente.

- As condições que se referem a subconsultas não podem ser empurradas para baixo.

- As condições que se referem a funções armazenadas não podem ser empurradas para baixo. Os motores de armazenamento não podem invocar funções armazenadas.

- As condições desencadeadas não podem ser deslocadas. (Para informações sobre condições desencadeadas, consulte a Seção 8.2.2.3, “Otimização de subconsultas com a estratégia EXISTS”.)

Para entender como essa otimização funciona, considere primeiro como um varredura de índice ocorre quando o Index Condition Pushdown não é usado:

1. Vá para a próxima linha, primeiro lendo o par ordenado do índice e, em seguida, usando o par ordenado do índice para localizar e ler a linha completa da tabela.

2. Teste a parte da condição `WHERE` que se aplica a esta tabela. Aceite ou rejeite a linha com base no resultado do teste.

Usando o Pushdown da Condição de Índice, a varredura prossegue da seguinte maneira:

1. Obtenha o tuplo de índice da próxima linha (mas não da linha completa da tabela).

2. Teste a parte da condição `WHERE` que se aplica a esta tabela e pode ser verificada usando apenas colunas de índice. Se a condição não for atendida, prossiga para o tuplo de índice da próxima linha.

3. Se a condição for atendida, use o tuplo de índice para localizar e ler a linha completa da tabela.

4. Teste a parte restante da condição `WHERE` que se aplica a esta tabela. Aceite ou rejeite a linha com base no resultado do teste.

A saída `EXPLAIN` mostra `Usando condição de índice` na coluna `Extra` quando o Pushdown de Condição de Índice é usado. Não mostra `Usando índice` porque isso não se aplica quando as linhas inteiras da tabela devem ser lidas.

Suponha que uma tabela contenha informações sobre pessoas e seus endereços e que a tabela tenha um índice definido como `INDEX (código_postal, apelido, nome_de_guerra)`. Se soubermos o valor do `código_postal` de uma pessoa, mas não tivermos certeza sobre o sobrenome, podemos fazer uma busca assim:

```sql
SELECT * FROM people
  WHERE zipcode='95054'
  AND lastname LIKE '%etrunia%'
  AND address LIKE '%Main Street%';
```

O MySQL pode usar o índice para percorrer pessoas com `zipcode='95054'`. A segunda parte (`lastname LIKE '%etrunia%'`) não pode ser usada para limitar o número de linhas que precisam ser percorridas, então, sem o Pushdown da Condição de Índice, essa consulta deve recuperar linhas completas da tabela para todas as pessoas que têm `zipcode='95054'`.

Com o recurso Index Condition Pushdown, o MySQL verifica a parte `lastname LIKE '%etrunia%'` antes de ler toda a linha da tabela. Isso evita a leitura de linhas completas correspondentes a tuplas de índice que correspondem à condição `zipcode`, mas não à condição `lastname`.

O índice Condition Pushdown está habilitado por padrão. Ele pode ser controlado com a variável de sistema `optimizer_switch` ao definir a bandeira `index_condition_pushdown`:

```sql
SET optimizer_switch = 'index_condition_pushdown=off';
SET optimizer_switch = 'index_condition_pushdown=on';
```

Consulte a Seção 8.9.2, “Otimizações comutadas”.
