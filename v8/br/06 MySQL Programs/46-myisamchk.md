### 6.6.4 myisamchk  MyISAM Utilitário de Manutenção de Mesas

O utilitário `myisamchk` obtém informações sobre suas tabelas de banco de dados ou verifica, repara ou otimiza-as. `myisamchk` funciona com tabelas `MyISAM` (tabelas que têm arquivos `.MYD` e `.MYI` para armazenar dados e índices).

Você também pode usar as instruções `CHECK TABLE` e `REPAIR TABLE` para verificar e reparar tabelas `MyISAM`.

O uso de `myisamchk` com tabelas particionadas não é suportado.

Precaução

É melhor fazer um backup de uma tabela antes de executar uma operação de reparo de tabela; sob algumas circunstâncias, a operação pode causar perda de dados.

Invocar `myisamchk` assim:

```
myisamchk [options] tbl_name ...
```

O `options` especifica o que você quer que `myisamchk` faça. Eles são descritos nas seções a seguir. Você também pode obter uma lista de opções invocando **myisamchk --help**.

Sem opções, `myisamchk` simplesmente verifica sua tabela como a operação padrão. Para obter mais informações ou dizer a `myisamchk` para tomar medidas corretivas, especifique opções como descrito na discussão a seguir.

`tbl_name` é a tabela do banco de dados que você deseja verificar ou reparar. Se você executar `myisamchk` em algum lugar que não seja no diretório do banco de dados, você deve especificar o caminho para o diretório do banco de dados, porque `myisamchk` não tem idéia de onde o banco de dados está localizado. Na verdade, `myisamchk` não se importa se os arquivos em que você está trabalhando estão localizados em um diretório de banco de dados. Você pode copiar os arquivos que correspondem a uma tabela de banco de dados em algum outro local e executar operações de recuperação neles.

Você pode nomear várias tabelas na linha de comando `myisamchk` se desejar. Você também pode especificar uma tabela nomeando seu arquivo de índice (o arquivo com o sufixo `.MYI`). Isso permite que você especifique todas as tabelas em um diretório usando o padrão `*.MYI`. Por exemplo, se você estiver em um diretório de banco de dados, você pode verificar todas as tabelas `MyISAM` nesse diretório assim:

```
myisamchk *.MYI
```

Se você não estiver no diretório do banco de dados, você pode verificar todas as tabelas lá especificando o caminho para o diretório:

```
myisamchk /path/to/database_dir/*.MYI
```

Você pode até mesmo verificar todas as tabelas em todos os bancos de dados especificando um wildcard com o caminho para o diretório de dados MySQL:

```
myisamchk /path/to/datadir/*/*.MYI
```

A maneira recomendada para verificar rapidamente todas as tabelas de `MyISAM` é:

```
myisamchk --silent --fast /path/to/datadir/*/*.MYI
```

Se você quiser verificar todas as tabelas `MyISAM` e reparar qualquer que esteja corrompido, você pode usar o seguinte comando:

```
myisamchk --silent --force --fast --update-state \
          --key_buffer_size=64M --myisam_sort_buffer_size=64M \
          --read_buffer_size=1M --write_buffer_size=1M \
          /path/to/datadir/*/*.MYI
```

Para mais informações sobre a alocação de memória com `myisamchk`, consulte a Seção 6.6.4.6, "Uso de memória do myisamchk".

Para informações adicionais sobre a utilização do `myisamchk`, ver Secção 9. 6, " Manutenção da tabela MyISAM e recuperação de acidentes".

Importância

\*Você deve garantir que nenhum outro programa está usando as tabelas enquanto você está executando `myisamchk`. O meio mais eficaz de fazer isso é fechar o servidor MySQL enquanto estiver executando `myisamchk`, ou bloquear todas as tabelas em que `myisamchk` está sendo usado.

Caso contrário, quando você executar `myisamchk`, ele pode exibir a seguinte mensagem de erro:

```
warning: clients are using or haven't closed the table properly
```

Isso significa que você está tentando verificar uma tabela que foi atualizada por outro programa (como o servidor mysqld) que ainda não fechou o arquivo ou que morreu sem fechar o arquivo corretamente, o que às vezes pode levar à corrupção de uma ou mais tabelas.

Se `mysqld` estiver em execução, você deve forçá-lo a limpar todas as modificações de tabela que ainda estão armazenadas na memória usando `FLUSH TABLES`. Você deve então garantir que ninguém esteja usando as tabelas enquanto você estiver executando `myisamchk`

No entanto, a maneira mais fácil de evitar este problema é usar `CHECK TABLE` em vez de `myisamchk` para verificar tabelas.

`myisamchk` suporta as seguintes opções, que podem ser especificadas na linha de comando ou no grupo `[myisamchk]` de um arquivo de opções. Para informações sobre os arquivos de opções usados por programas MySQL, consulte a Seção 6.2.2.2, Using Option Files.

**Tabela 6.17 opções de myisamchk**

<table><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Nome da opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td>- Analisar.</td> <td>Analisar a distribuição dos valores-chave</td> </tr><tr><td>- Backup.</td> <td>Fazer uma cópia de segurança do ficheiro .MYD como file_name-time.BAK</td> </tr><tr><td>- Procuramento de blocos</td> <td>Encontre o registro que um bloco no deslocamento dado pertence a</td> </tr><tr><td>--conjuntos de caracteres-dir</td> <td>Diretório onde podem ser encontrados conjuntos de caracteres</td> </tr><tr><td>- Verificar.</td> <td>Verifique se há erros na tabela</td> </tr><tr><td>- Verificar apenas alterado.</td> <td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td> </tr><tr><td>--correct-checksum</td> <td>Corrigir as informações relativas ao montante de verificação para o quadro</td> </tr><tr><td>--data-file-length</td> <td>Comprimento máximo do ficheiro de dados (quando recriar o ficheiro de dados quando estiver cheio)</td> </tr><tr><td>--debug</td> <td>Registro de depuração</td> </tr><tr><td>- ... bits de decodificação</td> <td>Decode_bits</td> </tr><tr><td>--defaults-extra-file</td> <td>Leia arquivo de opção nomeado além dos arquivos de opção habituais</td> </tr><tr><td>--defaults-file</td> <td>Arquivo de opções nomeadas somente para leitura</td> </tr><tr><td>--defaults-group-suffix</td> <td>Valor do sufixo do grupo de opções</td> </tr><tr><td>--descrição</td> <td>Imprimir algumas informações descritivas sobre a tabela</td> </tr><tr><td>- ... extend-check</td> <td>Fazer uma verificação muito completa da tabela ou reparação que tenta recuperar todas as linhas possíveis do arquivo de dados</td> </tr><tr><td>- Rápido.</td> <td>Verifique apenas as mesas que não foram fechadas corretamente</td> </tr><tr><td>- Força</td> <td>Fazer uma operação de reparação automaticamente se myisamchk encontrar qualquer erro na tabela</td> </tr><tr><td>- Força</td> <td>Sobrescrever arquivos temporários antigos. Para uso com a opção -r ou -o</td> </tr><tr><td>- ... palavra-limite</td> <td>Comprimento máximo de palavra para índices FULLTEXT</td> </tr><tr><td>- Minha palavra.</td> <td>Duração mínima das palavras para os índices FULLTEXT</td> </tr><tr><td>- Ficheiro de palavra-paragem</td> <td>Use palavras-paradas deste arquivo em vez da lista embutida</td> </tr><tr><td>- Ajuda .</td> <td>Mostrar mensagem de ajuda e sair</td> </tr><tr><td>- Ajuda .</td> <td>Mostrar mensagem de ajuda e sair</td> </tr><tr><td>--informação</td> <td>Imprimir estatísticas informativas sobre a tabela que é verificada</td> </tr><tr><td>--key_buffer_size</td> <td>Tamanho do buffer utilizado para os blocos de índice das tabelas MyISAM</td> </tr><tr><td>--chaves-usadas</td> <td>Um valor de bits que indica quais índices devem ser atualizados</td> </tr><tr><td>--max-record-length</td> <td>Skip linhas maiores do que o comprimento dado se myisamchk não pode alocar memória para mantê-los</td> </tr><tr><td>- Verificação média.</td> <td>Fazer uma verificação que é mais rápida do que uma operação de verificação de extensão</td> </tr><tr><td>-- meu tamanho de bloco</td> <td>Tamanho do bloco a utilizar para as páginas do índice MyISAM</td> </tr><tr><td>- O meu tamanho de tampão</td> <td>O buffer que é alocado ao classificar o índice ao fazer um REPAIR ou ao criar índices com CREATE INDEX ou ALTER TABLE</td> </tr><tr><td>- Não há padrões</td> <td>Não ler arquivos de opções</td> </tr><tr><td>- paralelas-recuperar</td> <td>Usa a mesma técnica que -r e -n, mas cria todas as teclas em paralelo, usando diferentes threads (beta)</td> </tr><tr><td>- Impressão padrão</td> <td>Opções padrão de impressão</td> </tr><tr><td>- Rápido.</td> <td>Alcançar uma reparação mais rápida por não modificar o arquivo de dados</td> </tr><tr><td>--read_buffer_size (tamanho do buffer de leitura)</td> <td>Cada thread que faz uma varredura sequencial atribui um buffer deste tamanho para cada tabela que ele varre</td> </tr><tr><td>-- somente leitura</td> <td>Não marque a tabela como verificada</td> </tr><tr><td>- Recuperar</td> <td>Fazer um reparo que pode corrigir quase qualquer problema exceto chaves únicas que não são únicos</td> </tr><tr><td>--seguro-recuperar</td> <td>Fazer um reparo usando um velho método de recuperação que lê através de todas as linhas em ordem e atualiza todas as árvores de índice com base nas linhas encontradas</td> </tr><tr><td>--acompanhamento automático</td> <td>Forçar a numeração AUTO_INCREMENT para que os novos registos comecem com o valor dado</td> </tr><tr><td>- Colagem.</td> <td>Especificar a coleta a utilizar para classificar índices de tabela</td> </tr><tr><td>- Silêncio.</td> <td>Modo silencioso</td> </tr><tr><td>--sort_buffer_size</td> <td>O buffer que é alocado ao classificar o índice ao fazer um REPAIR ou ao criar índices com CREATE INDEX ou ALTER TABLE</td> </tr><tr><td>- Índice de classificação</td> <td>Classificar os blocos de árvore de índice em ordem alta-baixa</td> </tr><tr><td>--sort_key_blocks</td> <td>sort_key_blocks (blocos de chave de ordem)</td> </tr><tr><td>--registros de classificação</td> <td>Classificar registos de acordo com um determinado índice</td> </tr><tr><td>- Recuperar.</td> <td>Forçar myisamchk para usar a classificação para resolver as chaves mesmo se os arquivos temporários seria muito grande</td> </tr><tr><td>- Método stats</td> <td>Especifica como o código de recolha de estatísticas de índice MyISAM deve tratar NULLs</td> </tr><tr><td>- Tmpdir</td> <td>Diretório a utilizar para armazenar ficheiros temporários</td> </tr><tr><td>- Desembalar.</td> <td>Desempacotar uma mesa que estava cheia com o meu pacote</td> </tr><tr><td>--update-state (Atualização de estado)</td> <td>Armazenar informações no arquivo .MYI para indicar quando a tabela foi verificada e se a tabela falhou</td> </tr><tr><td>- Verbosos.</td> <td>Modo Verbose</td> </tr><tr><td>- versão</td> <td>Informações de versão de exibição e saída</td> </tr><tr><td>- Espere.</td> <td>Espere a mesa bloqueada para ser desbloqueado, em vez de terminar</td> </tr><tr><td>-- write_buffer_size (tamanho do buffer de escrita)</td> <td>Escrever tamanho do buffer</td> </tr></tbody></table>
