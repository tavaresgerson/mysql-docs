#### 17.8.3.7 Excluindo ou Incluindo Páginas do Pool de Armazenamento de Buffer nos Arquivos de Núcleo

Um arquivo de núcleo registra o status e a imagem de memória de um processo em execução. Como o pool de armazenamento de buffer reside na memória principal, e a imagem de memória de um processo em execução é descarregada no arquivo de núcleo, sistemas com pools de armazenamento de buffer grandes podem gerar arquivos de núcleo grandes quando o processo **mysqld** morrer.

Arquivos de núcleo grandes podem ser problemáticos por várias razões, incluindo o tempo necessário para escrevê-los, a quantidade de espaço em disco que consomem e os desafios associados à transferência de arquivos grandes.

Excluir páginas do pool de armazenamento de buffer também pode ser desejável do ponto de vista de segurança se você tiver preocupações sobre a descarregamento de páginas de banco de dados nos arquivos de núcleo que podem ser compartilhados dentro ou fora de sua organização para fins de depuração.

Nota

O acesso aos dados presentes nas páginas do pool de armazenamento de buffer no momento em que o processo **mysqld** morreu pode ser benéfico em alguns cenários de depuração. Se houver dúvida sobre incluir ou excluir páginas do pool de armazenamento de buffer, consulte o Suporte do MySQL.

A opção `innodb_buffer_pool_in_core_file` é relevante apenas se a variável `core_file` estiver habilitada e o sistema operacional suportar a extensão não POSIX `MADV_DONTDUMP` da chamada de sistema `madvise()`, que é suportada no Linux 3.4 e versões posteriores. A extensão `MADV_DONTDUMP` faz com que páginas em um intervalo especificado sejam excluídas dos descarregamentos de núcleo. A opção `innodb_buffer_pool_in_core_file` é desabilitada por padrão em sistemas que suportam MADV_DONTDUMP, caso contrário, ela é definida como ON.

Para gerar arquivos de núcleo com páginas do pool de armazenamento de buffer, inicie o servidor com as opções `--core-file` e `--innodb-buffer-pool-in-core-file=ON`.

```
$> mysqld --core-file --innodb-buffer-pool-in-core-file=ON
```

A variável `core_file` é somente de leitura e desabilitada por padrão. Ela é habilitada especificando a opção `--core-file` na inicialização. A variável `innodb_buffer_pool_in_core_file` é dinâmica. Ela pode ser especificada na inicialização ou configurada em tempo de execução usando uma instrução `SET`.

```
mysql> SET GLOBAL innodb_buffer_pool_in_core_file=OFF;
```

Se a variável `innodb_buffer_pool_in_core_file` estiver desabilitada, mas o `MADV_DONTDUMP` não for suportado pelo sistema operacional ou ocorrer uma falha no `madvise()`, um aviso será escrito no log de erro do servidor MySQL e a variável `core_file` será desabilitada para evitar a gravação de arquivos de núcleo que, acidentalmente, incluam páginas do pool de buffer. Se a variável `core_file` somente de leitura for desabilitada, o servidor deve ser reiniciado para habilitá-la novamente.

A tabela a seguir mostra cenários de configuração e suporte ao `MADV_DONTDUMP` que determinam se arquivos de núcleo são gerados e se incluem páginas do pool de buffer.

**Tabela 17.4 Cenários de Configuração de Arquivos de Núcleo**

<table summary="Configuração do arquivo de núcleo e cenários de suporte ao MADV_DONTDUMP."><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 40%"/><thead><tr> <th><code>core_file</code></th> <th><code>innodb_buffer_pool_in_core_file</code></th> <th>Suporte ao MADV_DONTDUMP</th> <th>Resultado</th> </tr></thead><tbody><tr> <th>OFF (padrão)</th> <td>Não relevante para o resultado</th> <td>Não relevante para o resultado</th> <td>O arquivo de núcleo não é gerado</th> </tr><tr> <th>ON</th> <td>ON (padrão em sistemas sem suporte ao <code>MADV_DONTDUMP</code>)</td> <td>Não relevante para o resultado</th> <td>O arquivo de núcleo é gerado com páginas do buffer pool</th> </tr><tr> <th>ON</th> <td>OFF (padrão em sistemas com suporte ao <code>MADV_DONTDUMP</code>)</td> <td>Sim</td> <td>O arquivo de núcleo é gerado sem páginas do buffer pool</th> </tr><tr> <th>ON</th> <td>OFF</th> <td>Não</th> <td>O arquivo de núcleo não é gerado, <code>core_file</code> é desativado e um aviso é escrito no log de erro do servidor</th> </tr></tbody></table>

A redução no tamanho do arquivo de núcleo alcançada ao desabilitar a variável `innodb_buffer_pool_in_core_file` depende do tamanho do pool de buffers, mas também é afetada pelo tamanho da página do `InnoDB`. Um tamanho de página menor significa que mais páginas são necessárias para a mesma quantidade de dados, e mais páginas significam mais metadados de página. A tabela a seguir fornece exemplos de redução de tamanho que você pode ver para um pool de buffers de 1GB com diferentes tamanhos de páginas.

**Tabela 17.5 Tamanho do Arquivo de Núcleo com Páginas do Pool de Buffers Incluídas e Excluídas**

<table summary="Exemplos de redução de tamanho do arquivo de núcleo para diferentes tamanhos de páginas."><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th><code>innodb_page_size</code> Setting</th> <th>Páginas do Pool de Buffers Incluídas (<code>innodb_buffer_pool_in_core_file=ON</code>)</th> <th>Páginas do Pool de Buffers Excluídas (<code>innodb_buffer_pool_in_core_file=OFF</code>)</th> </tr></thead><tbody><tr> <th>4KB</th> <td>2.1GB</td> <td>0.9GB</td> </tr><tr> <th>64KB</th> <td>1.7GB</td> <td>0.7GB</td> </tr></tbody></table>