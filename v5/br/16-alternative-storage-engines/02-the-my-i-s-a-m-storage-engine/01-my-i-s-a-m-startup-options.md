### 15.2.1 Opções de Inicialização MyISAM

As seguintes opções para o **mysqld** podem ser usadas para alterar o comportamento das tabelas `MyISAM`. Para informações adicionais, consulte a Seção 5.1.6, “Opções de Comando do Servidor”.

**Tabela 15.3 Referência de Opções e Variáveis MyISAM**

<table frame="box" rules="all" summary="Referência para opções de linha de comando e variáveis de sistema MyISAM."><col style="width: 20%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><thead><tr><th>Nome</th> <th>Linha de Cmd</th> <th>Arquivo de Opções</th> <th>Var do Sistema</th> <th>Var de Status</th> <th>Escopo da Var</th> <th>Dinâmica</th> </tr></thead><tbody><tr><th>bulk_insert_buffer_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr><tr><th>concurrent_insert</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>delay_key_write</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>have_rtree_keys</th> <td></td> <td></td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>key_buffer_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>log-isam</th> <td>Sim</td> <td>Sim</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th>myisam-block-size</th> <td>Sim</td> <td>Sim</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th>myisam_data_pointer_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>myisam_max_sort_file_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>myisam_mmap_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>myisam_recover_options</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>myisam_repair_threads</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr><tr><th>myisam_sort_buffer_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr><tr><th>myisam_stats_method</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr><tr><th>myisam_use_mmap</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>tmp_table_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr> </tbody></table>

As seguintes variáveis de sistema afetam o comportamento das tabelas `MyISAM`. Para informações adicionais, consulte a Seção 5.1.7, “Variáveis de Sistema do Servidor”.

* `bulk_insert_buffer_size`

  O tamanho do cache de árvore usado na otimização de inserção em massa (bulk insert).

  Nota

  Este é um limite *por Thread*!

* `delay_key_write=ALL`

  Não faça o flush dos key buffers entre as operações de escrita para qualquer tabela `MyISAM`.

  Nota

  Se você fizer isso, você não deve acessar tabelas `MyISAM` a partir de outro programa (como outro servidor MySQL ou com **myisamchk**) enquanto as tabelas estiverem em uso. Fazer isso arrisca a corrupção do Index. O uso de `--external-locking` não elimina este risco.

* `myisam_max_sort_file_size`

  O tamanho máximo do arquivo temporário que o MySQL tem permissão para usar ao recriar um Index `MyISAM` (durante `REPAIR TABLE`, `ALTER TABLE` ou `LOAD DATA`). Se o tamanho do arquivo for maior que este valor, o Index é criado usando o key cache, o que é mais lento. O valor é fornecido em bytes.

* `myisam_recover_options=mode`

  Define o modo para recuperação automática de tabelas `MyISAM` que falharam (crashed).

* `myisam_sort_buffer_size`

  Define o tamanho do Buffer usado ao recuperar tabelas.

A recuperação automática é ativada se você iniciar o **mysqld** com a variável de sistema `myisam_recover_options` configurada. Neste caso, quando o servidor abre uma tabela `MyISAM`, ele verifica se a tabela está marcada como falhada (crashed) ou se a variável de contagem de abertura (open count) para a tabela não é 0 e você está executando o servidor com external locking desabilitado. Se qualquer uma dessas condições for verdadeira, o seguinte ocorre:

* O servidor verifica a tabela em busca de erros.
* Se o servidor encontrar um erro, ele tenta fazer um reparo rápido da tabela (com ordenação e sem recriar o arquivo de dados).

* Se o reparo falhar devido a um erro no arquivo de dados (por exemplo, um erro de duplicate-key), o servidor tenta novamente, desta vez recriando o arquivo de dados.

* Se o reparo ainda falhar, o servidor tenta mais uma vez com o método de opção de reparo antigo (escrever linha por linha sem ordenação). Este método deve ser capaz de reparar qualquer tipo de erro e tem baixos requisitos de espaço em disco.

Se a recuperação não for capaz de recuperar todas as linhas de comandos (statements) concluídos anteriormente e você não especificou `FORCE` no valor da variável de sistema `myisam_recover_options`, o reparo automático é abortado com uma mensagem de erro no error log:

```sql
Error: Couldn't repair table: test.g00pages
```

Se você especificar `FORCE`, um aviso como este é escrito em vez disso:

```sql
Warning: Found 344 of 354 rows when repairing ./test/g00pages
```

Se o valor da recuperação automática incluir `BACKUP`, o processo de recuperação cria arquivos com nomes no formato `tbl_name-datetime.BAK`. Você deve ter um script **cron** que mova automaticamente esses arquivos dos diretórios do Database para a mídia de backup.