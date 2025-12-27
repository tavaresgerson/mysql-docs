### 18.2.1 Opções de Inicialização do MyISAM

As seguintes opções para o **mysqld** podem ser usadas para alterar o comportamento das tabelas `MyISAM`. Para obter informações adicionais, consulte a Seção 7.1.7, “Opções de Comando do Servidor”.

**Tabela 18.3 Referência de Opção e Variável do MyISAM**

<table frame="box" rules="all" summary="Referência para as opções de linha de comando do MyISAM e variáveis do sistema.">
<col style="width: 20%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/>
<thead><tr><th scope="col">Nome</th> <th scope="col">Linha de Comando</th> <th scope="col">Arquivo de Opções</th> <th scope="col">Var do Sistema</th> <th scope="col">Var de Status</th> <th scope="col">Alcance do Var</th> <th scope="col">Dinâmico</th> </tr></thead><tbody><tr><th scope="row"><a class="link" href="server-system-variables.html#sysvar_bulk_insert_buffer_size">bulk_insert_buffer_size</a></th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr><tr><th scope="row"><a class="link" href="server-system-variables.html#sysvar_concurrent_insert">concurrent_insert</a></th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th scope="row"><a class="link" href="server-system-variables.html#sysvar_delay_key_write">delay_key_write</a></th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th scope="row"><a class="link" href="server-system-variables.html#sysvar_have_rtree_keys">have_rtree_keys</a></th> <td></td> <td></td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th scope="row"><a class="link" href="server-system-variables.html#sysvar_key_buffer_size">key_buffer_size</a></th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th scope="row"><a class="link" href="server-options.html#option_mysqld_log-isam">log-isam</a></th> <td>Sim</td> <td>Sim</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="server-options.html#option_mysqld_myisam-block-size">myisam-block-size</a></th> <td>Sim</td> <td>Sim</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="server-system-variables.html#sysvar_myisam_data_pointer_size">myisam_data_pointer_size</a></th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th scope="row"><a class="link" href="server-system-variables.html#sysvar_myisam_max_sort_file_size">myisam_max_sort_file_size</a></th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th scope="row"><a class="link" href="server-system-variables.html#sysvar_myisam_mmap_size">myisam_mmap_size</a></th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Não</td> <td>Sim</td> </tr><tr><th scope="row"><a class="link" href="server-system-variables.html#sysvar_myisam_recover_options">myisam_recover_options</a></th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th scope="row"><a class="link" href="server-system-variables.html#sysvar_myisam_sort_buffer_size">myisam_sort_buffer_size</a></th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr><tr><th scope="row"><a class="link" href="server-system-variables.html#sysvar_

As seguintes variáveis de sistema afetam o comportamento das tabelas `MyISAM`. Para obter informações adicionais, consulte a Seção 7.1.8, “Variáveis do Sistema do Servidor”.

* `bulk_insert_buffer_size`

  O tamanho do cache de árvore usado na otimização de inserção em lote.

  Nota

  Este é um limite *por fio*!

* `delay_key_write=ALL`

  Não limpe os buffers de chave entre as escritas para qualquer tabela `MyISAM`.

  Nota

  Se você fizer isso, não deve acessar as tabelas `MyISAM` de outro programa (como de outro servidor MySQL ou com **myisamchk**) quando as tabelas estiverem em uso. Isso pode comprometer o índice. O uso de `--external-locking` não elimina esse risco.

* `myisam_max_sort_file_size`

  O tamanho máximo do arquivo temporário que o MySQL é permitido usar ao recriar um índice `MyISAM` (durante `REPAIR TABLE`, `ALTER TABLE` ou `LOAD DATA`). Se o tamanho do arquivo for maior que esse valor, o índice é criado usando o cache de chave, o que é mais lento. O valor é dado em bytes.

* `myisam_recover_options=mode`

  Defina o modo para a recuperação automática de tabelas `MyISAM` que entraram em falha.

* `myisam_sort_buffer_size`

  Defina o tamanho do buffer usado ao recuperar tabelas.

A recuperação automática é ativada se você iniciar o **mysqld** com a variável de sistema `myisam_recover_options` definida. Nesse caso, quando o servidor abre uma tabela `MyISAM`, ele verifica se a tabela está marcada como falha ou se a variável de contagem de abertura da tabela não for 0 e você estiver executando o servidor com o bloqueio externo desativado. Se uma dessas condições for verdadeira, o seguinte acontece:

* O servidor verifica a tabela em busca de erros.
* Se o servidor encontrar um erro, ele tenta fazer uma rápida reparação da tabela (com ordenação e sem recriar o arquivo de dados).

* Se a reparação falhar devido a um erro no arquivo de dados (por exemplo, um erro de chave duplicada), o servidor tenta novamente, desta vez recriando o arquivo de dados.

* Se a reparação ainda falhar, o servidor tenta mais uma vez com o método de opção de reparação antiga (escrever linha por linha sem ordenação). Esse método deve ser capaz de reparar qualquer tipo de erro e tem requisitos baixos de espaço em disco.

Se a recuperação não conseguir recuperar todas as linhas de declarações concluídas anteriormente e você não especificar `FORCE` no valor da variável de sistema `myisam_recover_options`, a reparação automática interrompe com uma mensagem de erro no log de erro:

```
Error: Couldn't repair table: test.g00pages
```

Se você especificar `FORCE`, é escrito um aviso como este:

```
Warning: Found 344 of 354 rows when repairing ./test/g00pages
```

Se o valor de recuperação automática incluir `BACKUP`, o processo de recuperação cria arquivos com nomes na forma `tbl_name-datetime.BAK`. Você deve ter um **cron** script que mova automaticamente esses arquivos dos diretórios do banco de dados para mídia de backup.