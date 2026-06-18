#### 17.8.3.7 Exclusão de Páginas do Banco de Armazenamento de Buffer dos Arquivos Principais

Um arquivo de núcleo registra o status e a imagem de memória de um processo em execução. Como o pool de buffers reside na memória principal, e a imagem de memória de um processo em execução é descarregada no arquivo de núcleo, sistemas com grandes pools de buffers podem gerar arquivos de núcleo grandes quando o processo **mysqld** morrer.

Arquivos de núcleo grandes podem ser problemáticos por várias razões, incluindo o tempo necessário para escrevê-los, a quantidade de espaço em disco que consomem e os desafios associados à transferência de arquivos grandes.

Para reduzir o tamanho do arquivo de núcleo, você pode desabilitar a variável `innodb_buffer_pool_in_core_file` para omitir páginas do pool de buffers dos dumps de núcleo. A variável `innodb_buffer_pool_in_core_file` foi introduzida no MySQL 8.0.14 e está habilitada por padrão.

Excluir as páginas do pool de buffers também pode ser desejável sob uma perspectiva de segurança, se você tiver preocupações sobre o descarte de páginas do banco de dados em arquivos principais que possam ser compartilhados dentro ou fora da sua organização para fins de depuração.

Nota

O acesso aos dados presentes nas páginas do pool de buffers no momento em que o processo **mysqld** morreu pode ser benéfico em alguns cenários de depuração. Se tiver dúvidas sobre a inclusão ou exclusão das páginas do pool de buffers, consulte o Suporte do MySQL.

A desativação de `innodb_buffer_pool_in_core_file` só tem efeito se a variável `core_file` estiver habilitada e o sistema operacional suportar a extensão não POSIX `MADV_DONTDUMP` da chamada de sistema madvise(), que é suportada no Linux 3.4 e versões posteriores. A extensão `MADV_DONTDUMP` faz com que as páginas em um intervalo especificado sejam excluídas dos registros de núcleo.

Supondo que o sistema operacional suporte a extensão `MADV_DONTDUMP`, inicie o servidor com as opções `--core-file` e `--innodb-buffer-pool-in-core-file=OFF` para gerar arquivos de núcleo sem páginas do pool de buffers.

```
$> mysqld --core-file --innodb-buffer-pool-in-core-file=OFF
```

A variável `core_file` é somente de leitura e desabilitada por padrão. Ela é habilitada especificando a opção `--core-file` durante a inicialização. A variável `innodb_buffer_pool_in_core_file` é dinâmica. Ela pode ser especificada durante a inicialização ou configurada em tempo de execução usando uma declaração `SET`.

```
mysql> SET GLOBAL innodb_buffer_pool_in_core_file=OFF;
```

Se a variável `innodb_buffer_pool_in_core_file` estiver desativada, mas o `MADV_DONTDUMP` não for suportado pelo sistema operacional ou ocorrer uma falha no `madvise()`, um aviso será escrito no log de erro do servidor MySQL e a variável `core_file` será desativada para evitar a gravação de arquivos principais que incluam acidentalmente páginas do pool de buffers. Se a variável `core_file` somente leitura for desativada, o servidor precisará ser reiniciado para a reativação.

A tabela a seguir mostra os cenários de configuração e suporte ao `MADV_DONTDUMP` que determinam se os arquivos principais são gerados e se eles incluem páginas do pool de buffers.

**Tabela 17.4 Cenários de Configuração do Arquivo Principal**

<table summary="Configuração do arquivo principal e cenários de suporte ao MADV_DONTDUMP."><thead><tr> <th scope="col">[[<code>core_file</code>]] variável</th> <th scope="col">[[<code>innodb_buffer_pool_in_core_file</code>]] variável</th> <th scope="col">madvise() MADV_DONTDUMP Suporte</th> <th scope="col">Resultado</th> </tr></thead><tbody><tr> <th>OFF (padrão)</th> <td>Não relevante para o resultado</td> <td>Não relevante para o resultado</td> <td>Arquivo principal não foi gerado</td> </tr><tr> <th>ON</th> <td>ON (padrão)</td> <td>Não relevante para o resultado</td> <td>O arquivo principal é gerado com páginas do pool de buffers</td> </tr><tr> <th>ON</th> <td>OFF</td> <td>Sim</td> <td>O arquivo principal é gerado sem páginas do pool de buffers</td> </tr><tr> <th>ON</th> <td>OFF</td> <td>Não</td> <td>O arquivo principal não foi gerado, [[<code>core_file</code>]] está desativado e um aviso foi escrito no log de erros do servidor</td> </tr></tbody></table>

A redução no tamanho do arquivo de núcleo alcançada ao desabilitar a variável `innodb_buffer_pool_in_core_file` depende do tamanho do pool de buffers, mas também é afetada pelo tamanho da página `InnoDB`. Um tamanho de página menor significa que mais páginas são necessárias para a mesma quantidade de dados, e mais páginas significam mais metadados de página. A tabela a seguir fornece exemplos de redução de tamanho que você pode ver para um pool de buffers de 1 GB com diferentes tamanhos de páginas.

**Tabela 17.5 Tamanho do arquivo principal com páginas do pool de buffers incluídas e excluídas**

<table summary="Exemplos de redução do tamanho do arquivo principal para diferentes tamanhos de páginas."><thead><tr> <th scope="col">[[<code>innodb_page_size</code>]] Definição</th> <th scope="col">Páginas do Pool de Buffer Incluídas ([[<code>innodb_buffer_pool_in_core_file=ON</code>]])</th> <th scope="col">Páginas do Banco de Armazenamento de Buffer Excluídas ([[<code>innodb_buffer_pool_in_core_file=OFF</code>]])</th> </tr></thead><tbody><tr> <th>4 KB</th> <td>2,1 GB</td> <td>0,9 GB</td> </tr><tr> <th>64 KB</th> <td>1,7 GB</td> <td>0,7 GB</td> </tr></tbody></table>
