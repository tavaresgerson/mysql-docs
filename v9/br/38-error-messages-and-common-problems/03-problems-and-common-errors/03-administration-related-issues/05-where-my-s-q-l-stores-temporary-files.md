#### B.3.3.5 Onde o MySQL Armazena Arquivos Temporários

No Unix, o MySQL usa o valor da variável de ambiente `TMPDIR` como o nome do caminho do diretório onde os arquivos temporários serão armazenados. Se `TMPDIR` não estiver definido, o MySQL usa o padrão do sistema, que geralmente é `/tmp`, `/var/tmp` ou `/usr/tmp`.

No Windows, o MySQL verifica em ordem os valores das variáveis de ambiente `TMPDIR`, `TEMP` e `TMP`. Para o primeiro valor encontrado como definido, o MySQL usa-o e não verifica os demais. Se nenhum dos valores de `TMPDIR`, `TEMP` ou `TMP` estiver definido, o MySQL usa o padrão do sistema do Windows, que geralmente é `C:\windows\temp\`.

Se o sistema de arquivos que contém o diretório de seus arquivos temporários for muito pequeno, você pode usar a opção **mysqld** `--tmpdir` para especificar um diretório em um sistema de arquivos onde você tenha espaço suficiente.

A opção `--tmpdir` pode ser definida como uma lista de vários caminhos que são usados de forma rotativa. Os caminhos devem ser separados por colchetes (`:`) no Unix e por pontos e vírgulas (`;`) no Windows.

Observação

Para espalhar a carga de forma eficaz, esses caminhos devem estar localizados em diferentes *discos físicos*, não em diferentes partições do mesmo disco.

Se o servidor MySQL estiver atuando como uma replica, você pode definir a variável de sistema `replica_load_tmpdir` para especificar um diretório separado para armazenar arquivos temporários ao replicar instruções `LOAD DATA`. Esse diretório deve estar em um sistema de arquivos baseado em disco (não em um sistema de arquivos baseado em memória) para que os arquivos temporários usados para replicar o `LOAD DATA` possam sobreviver a reinicializações da máquina. O diretório também não deve ser um que seja limpo pelo sistema operacional durante o processo de inicialização do sistema. No entanto, a replicação agora pode continuar após um reinício se os arquivos temporários tiverem sido removidos.

O MySQL garante que os arquivos temporários sejam removidos se o **mysqld** for encerrado. Em plataformas que o suportam (como o Unix), isso é feito desvinculando o arquivo após abri-lo. A desvantagem disso é que o nome não aparece nas listagens de diretórios e você não vê um grande arquivo temporário que preenche o sistema de arquivos no qual o diretório do arquivo temporário está localizado. (Nesses casos, **lsof +L1** pode ser útil para identificar arquivos grandes associados ao **mysqld**.)

Ao ordenar (`ORDER BY` ou `GROUP BY`), o MySQL normalmente usa um ou dois arquivos temporários. O espaço em disco máximo necessário é determinado pela seguinte expressão:

```
(length of what is sorted + sizeof(row pointer))
* number of matched rows
* 2
```

O tamanho do ponteiro da linha geralmente é de quatro bytes, mas pode aumentar no futuro para tabelas muito grandes.

Para algumas instruções, o MySQL cria tabelas SQL temporárias que não são ocultas e têm nomes que começam com `#sql`.

Algumas consultas `SELECT` criam tabelas SQL temporárias para armazenar resultados intermediários.

Operações DDL que reconstruem a tabela e não são executadas online usando a técnica `ALGORITHM=INPLACE` criam uma cópia temporária da tabela original no mesmo diretório da tabela original.

Operações DDL online podem usar arquivos de log temporários para registrar DML concorrente, arquivos de classificação temporários ao criar um índice e arquivos de tabelas intermediárias temporárias ao reconstruir a tabela. Para mais informações, consulte a Seção 17.12.3, “Requisitos de Espaço DDL Online”.

As tabelas temporárias temporárias criadas pelo usuário do `InnoDB` e as tabelas temporárias internas no disco são criadas em um arquivo de tabelas temporárias chamado `ibtmp1` no diretório de dados do MySQL. Para mais informações, consulte a Seção 17.6.3.5, “Tabelas de Espaço Temporário”.

Veja também a Seção 17.15.7, “Tabela de Informações Temporárias da Tabela de Schema INFORMATION_SCHEMA do InnoDB”.

O modificador opcional `EXTENDED` faz com que `SHOW TABLES` liste tabelas ocultas criadas por declarações `ALTER TABLE` que falharam. Veja a Seção 15.7.7.40, “Declaração SHOW TABLES”.