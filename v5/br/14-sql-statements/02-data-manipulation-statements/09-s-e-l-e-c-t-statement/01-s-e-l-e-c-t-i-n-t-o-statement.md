#### 13.2.9.1 Declaração SELECT ... INTO

A forma `SELECT ... INTO` da declaração `SELECT` permite que o resultado de uma Query seja armazenado em variáveis ou escrito em um arquivo:

* `SELECT ... INTO var_list` seleciona valores de colunas e os armazena em variáveis.

* `SELECT ... INTO OUTFILE` escreve as Rows selecionadas em um arquivo. Terminadores de coluna e linha podem ser especificados para produzir um formato de saída específico.

* `SELECT ... INTO DUMPFILE` escreve uma única Row em um arquivo sem nenhuma formatação.

Uma dada declaração `SELECT` pode conter no máximo uma cláusula `INTO`, embora, conforme mostrado pela descrição da sintaxe de `SELECT` (veja [Seção 13.2.9, “Declaração SELECT”]), o `INTO` possa aparecer em diferentes posições:

* Antes de `FROM`. Exemplo:

  ```sql
  SELECT * INTO @myvar FROM t1;
  ```

* Antes de uma cláusula de Lock final. Exemplo:

  ```sql
  SELECT * FROM t1 INTO @myvar FOR UPDATE;
  ```

Uma cláusula `INTO` não deve ser usada em um `SELECT` aninhado porque tal `SELECT` deve retornar seu resultado ao contexto externo. Também há restrições sobre o uso de `INTO` dentro de declarações `UNION`; veja [Seção 13.2.9.3, “Cláusula UNION”].

Para a variante `INTO var_list`:

* *`var_list`* nomeia uma lista de uma ou mais variáveis, cada uma das quais pode ser uma variável definida pelo usuário, um parâmetro de Stored Procedure ou Function, ou uma variável local de Stored Program. (Dentro de uma declaração preparada `SELECT ... INTO var_list`, apenas variáveis definidas pelo usuário são permitidas; veja [Seção 13.6.4.2, “Escopo e Resolução de Variável Local”].)

* Os valores selecionados são atribuídos às variáveis. O número de variáveis deve corresponder ao número de colunas. A Query deve retornar uma única Row. Se a Query não retornar nenhuma Row, um Warning com código de erro 1329 ocorre (`No data`), e os valores das variáveis permanecem inalterados. Se a Query retornar múltiplas Rows, o erro 1172 ocorre (`Result consisted of more than one row`). Se for possível que a declaração possa recuperar múltiplas Rows, você pode usar `LIMIT 1` para limitar o conjunto de resultados a uma única Row.

  ```sql
  SELECT id, data INTO @x, @y FROM test.t1 LIMIT 1;
  ```

Nomes de variáveis de usuário não diferenciam maiúsculas de minúsculas (case-sensitive). Veja [Seção 9.4, “Variáveis Definidas pelo Usuário”].

A forma `SELECT ... INTO OUTFILE 'file_name'` da declaração `SELECT` escreve as Rows selecionadas em um arquivo. O arquivo é criado no host do Server, então você deve ter o privilégio `FILE` para usar esta sintaxe. *`file_name`* não pode ser um arquivo existente, o que, entre outras coisas, impede que arquivos como `/etc/passwd` e tabelas de Database sejam modificados. A variável de sistema `character_set_filesystem` controla a interpretação do nome do arquivo.

A declaração `SELECT ... INTO OUTFILE` destina-se a permitir o Dump de uma tabela para um arquivo de texto no host do Server. Para criar o arquivo resultante em algum outro host, `SELECT ... INTO OUTFILE` normalmente é inadequado porque não há como escrever um Path para o arquivo relativo ao File System do host do Server, a menos que o local do arquivo no host remoto possa ser acessado usando um Path mapeado na rede no File System do host do Server.

Alternativamente, se o software cliente MySQL estiver instalado no host remoto, você pode usar um comando cliente como `mysql -e "SELECT ..." > file_name` para gerar o arquivo nesse host.

`SELECT ... INTO OUTFILE` é o complemento de `LOAD DATA`. Os valores das colunas são escritos convertidos para o Character Set especificado na cláusula `CHARACTER SET`. Se nenhuma cláusula como essa estiver presente, os valores são despejados (dumped) usando o Character Set `binary`. Na prática, não há conversão de Character Set. Se um conjunto de resultados contiver colunas em vários Character Sets, o arquivo de dados de saída também o fará, e pode não ser possível recarregar (reload) o arquivo corretamente.

A sintaxe para a parte *`export_options`* da declaração consiste nas mesmas cláusulas `FIELDS` e `LINES` que são usadas com a declaração `LOAD DATA`. Para informações mais detalhadas sobre as cláusulas `FIELDS` e `LINES`, incluindo seus valores Default e valores permitidos, veja [Seção 13.2.6, “Declaração LOAD DATA”].

`FIELDS ESCAPED BY` controla como escrever caracteres especiais. Se o caractere `FIELDS ESCAPED BY` não estiver vazio, ele é usado, quando necessário, para evitar ambiguidade como um prefixo que precede os seguintes caracteres na saída:

* O caractere `FIELDS ESCAPED BY`
* O caractere `FIELDS [OPTIONALLY] ENCLOSED BY`
* O primeiro caractere dos valores `FIELDS TERMINATED BY` e `LINES TERMINATED BY`
* ASCII `NUL` (o byte de valor zero; o que é realmente escrito após o caractere de Escape é ASCII `0`, não um byte de valor zero)

Os caracteres `FIELDS TERMINATED BY`, `ENCLOSED BY`, `ESCAPED BY`, ou `LINES TERMINATED BY` *devem* ser escapados para que você possa ler o arquivo de volta (read back) de forma confiável. ASCII `NUL` é escapado para facilitar a visualização com alguns Pagers.

O arquivo resultante não precisa estar em conformidade com a sintaxe SQL, portanto, nenhuma outra coisa precisa ser escapada.

Se o caractere `FIELDS ESCAPED BY` estiver vazio, nenhum caractere será escapado e `NULL` será gerado como `NULL`, não `\N`. Provavelmente não é uma boa ideia especificar um caractere de Escape vazio, especialmente se os valores de Field em seus dados contiverem algum dos caracteres listados acima.

Aqui está um exemplo que produz um arquivo no formato de valores separados por vírgula (CSV), usado por muitos programas:

```sql
SELECT a,b,a+b INTO OUTFILE '/tmp/result.txt'
  FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
  LINES TERMINATED BY '\n'
  FROM test_table;
```

Se você usar `INTO DUMPFILE` em vez de `INTO OUTFILE`, o MySQL escreverá apenas uma Row no arquivo, sem nenhuma terminação de coluna ou linha e sem realizar nenhum processamento de Escape. Isso é útil para selecionar um valor `BLOB` e armazená-lo em um arquivo.

Nota

Qualquer arquivo criado por `INTO OUTFILE` ou `INTO DUMPFILE` é gravável (writable) por todos os usuários no host do Server. A razão para isso é que o Server MySQL não pode criar um arquivo que seja de propriedade de ninguém além do usuário sob cuja conta ele está sendo executado. (Você *nunca* deve executar o **mysqld** como `root` por esta e outras razões.) Portanto, o arquivo deve ser gravável por todos (world-writable) para que você possa manipular seu conteúdo.

Se a variável de sistema `secure_file_priv` estiver definida com um nome de diretório não vazio, o arquivo a ser escrito deve estar localizado nesse diretório.

No contexto de declarações `SELECT ... INTO` que ocorrem como parte de eventos executados pelo Event Scheduler, as mensagens de diagnóstico (não apenas Errors, mas também Warnings) são gravadas no Log de Erros e, no Windows, no Log de Eventos do aplicativo. Para obter informações adicionais, veja [Seção 23.4.5, “Status do Event Scheduler”].