#### 17.6.3.1 Espaço de Tabela do Sistema

O espaço de tabela do sistema é a área de armazenamento do buffer de alterações. Ele também pode conter dados de tabelas e índices se as tabelas forem criadas no espaço de tabela do sistema, em vez de espaços de tabela por arquivo ou espaços de tabelas gerais. Em versões anteriores do MySQL, o espaço de tabela do sistema continha o dicionário de dados `InnoDB`. No MySQL 8.0, `InnoDB` armazena metadados no dicionário de dados do MySQL. Veja o Capítulo 16, *Dicionário de Dados do MySQL*. Em versões anteriores do MySQL, o espaço de tabela do sistema também continha a área de armazenamento do buffer de escrita dupla. Essa área de armazenamento reside em arquivos de escrita dupla separados a partir do MySQL 8.0.20. Veja a Seção 17.6.4, “Buffer de Escrita Dupla”.

O espaço de tabela do sistema pode ter um ou mais arquivos de dados. Por padrão, um único arquivo de dados do espaço de tabela do sistema, com o nome `ibdata1`, é criado no diretório de dados. O tamanho e o número de arquivos de dados do espaço de tabela do sistema são definidos pela opção de inicialização `innodb_data_file_path`. Para informações de configuração, consulte Configuração do Arquivo de Dados do Espaço de Tabela do Sistema.

Informações adicionais sobre o espaço de tabela do sistema estão fornecidas nos tópicos a seguir na seção:

- Redimensionar o espaço de tabela do sistema
- Usando Partições de Disco Bruto para o Espaço de Tabela do Sistema

##### Redimensionar o espaço de tabela do sistema

Esta seção descreve como aumentar ou diminuir o tamanho do espaço de tabela do sistema.

###### Aumentar o espaço de tabelas do sistema

A maneira mais fácil de aumentar o tamanho do espaço de tabela do sistema é configurá-lo para ser autoextensivo. Para fazer isso, especifique o atributo `autoextend` para o último arquivo de dados no ajuste `innodb_data_file_path` e reinicie o servidor. Por exemplo:

```
innodb_data_file_path=ibdata1:10M:autoextend
```

Quando o atributo `autoextend` é especificado, o arquivo de dados aumenta automaticamente em incrementos de 8 MB à medida que o espaço necessário é necessário. A variável `innodb_autoextend_increment` controla o tamanho do incremento.

Você também pode aumentar o tamanho do espaço de tabela do sistema adicionando outro arquivo de dados. Para fazer isso:

1. Pare o servidor MySQL.

2. Se o último arquivo de dados no ajuste `innodb_data_file_path` estiver definido com o atributo `autoextend`, remova-o e modifique o atributo de tamanho para refletir o tamanho atual do arquivo de dados. Para determinar o tamanho apropriado do arquivo de dados a ser especificado, verifique o tamanho do arquivo no seu sistema de arquivos e arredonde esse valor para o valor mais próximo em MB, onde um MB é igual a 1024 x 1024 bytes.

3. Adicione um novo arquivo de dados ao ajuste `innodb_data_file_path`, especificando opcionalmente o atributo `autoextend`. O atributo `autoextend` só pode ser especificado para o último arquivo de dados no ajuste `innodb_data_file_path`.

4. Inicie o servidor MySQL.

Por exemplo, este tablespace tem um arquivo de dados com expansão automática:

```
innodb_data_home_dir =
innodb_data_file_path = /ibdata/ibdata1:10M:autoextend
```

Suponha que o arquivo de dados tenha crescido para 988 MB ao longo do tempo. Esta é a configuração `innodb_data_file_path` após a modificação do atributo de tamanho para refletir o tamanho atual do arquivo de dados e após a especificação de um novo arquivo de dados auto-extensível de 50 MB:

```
innodb_data_home_dir =
innodb_data_file_path = /ibdata/ibdata1:988M;/disk2/ibdata2:50M:autoextend
```

Ao adicionar um novo arquivo de dados, não especifique um nome de arquivo existente. `InnoDB` cria e inicializa o novo arquivo de dados quando você inicia o servidor.

Nota

Você não pode aumentar o tamanho de um arquivo de dados de espaço de tabela de sistema existente alterando seu atributo de tamanho. Por exemplo, alterar o ajuste `innodb_data_file_path` de `ibdata1:10M:autoextend` para `ibdata1:12M:autoextend` produz o seguinte erro ao iniciar o servidor:

```
[ERROR] [MY-012263] [InnoDB] The Auto-extending innodb_system
data file './ibdata1' is of a different size 640 pages (rounded down to MB) than
specified in the .cnf file: initial 768 pages, max 0 (relevant if non-zero) pages!
```

O erro indica que o tamanho do arquivo de dados existente (expresso em `InnoDB` páginas) é diferente do tamanho do arquivo de dados especificado no arquivo de configuração. Se você encontrar esse erro, restaure a configuração anterior `innodb_data_file_path` e consulte as instruções para o redimensionamento do espaço de tabela do sistema.

###### Reduzindo o tamanho do espaço de tabela do InnoDB

A redução do tamanho de um espaço de tabela de sistema existente não é suportada. A única opção para obter um espaço de tabela de sistema menor é restaurar seus dados de um backup para uma nova instância do MySQL criada com a configuração desejada do tamanho do espaço de tabela de sistema.

Para obter informações sobre como criar backups, consulte a Seção 17.18.1, “Backup do InnoDB”.

Para obter informações sobre a configuração de arquivos de dados para um novo espaço de tabela do sistema, consulte Configuração de arquivo de dados do espaço de tabela do sistema.

Para evitar um grande espaço de tabela do sistema, considere usar espaços de tabela por arquivo ou espaços de tabela gerais para seus dados. Os espaços de tabela por arquivo são o tipo de espaço de tabela padrão e são usados implicitamente ao criar uma tabela `InnoDB`. Ao contrário do espaço de tabela do sistema, os espaços de tabela por arquivo devolvem espaço em disco ao sistema operacional quando são truncados ou excluídos. Para mais informações, consulte a Seção 17.6.3.2, “Espaços de tabela por arquivo”. Os espaços de tabela gerais são espaços de tabela multitabela que também podem ser usados como alternativa ao espaço de tabela do sistema. Consulte a Seção 17.6.3.3, “Espaços de tabela gerais”.

##### Usando Partições de Disco Bruto para o Espaço de Tabela do Sistema

As partições de disco bruto podem ser usadas como arquivos de dados do espaço de tabela do sistema. Essa técnica permite o I/O sem buffer em sistemas Windows e alguns sistemas Linux e Unix sem sobrecarga do sistema de arquivos. Realize testes com e sem partições brutais para verificar se elas melhoram o desempenho do seu sistema.

Ao usar uma partição de disco bruto, certifique-se de que o ID de usuário que executa o servidor MySQL tenha privilégios de leitura e escrita para essa partição. Por exemplo, se o servidor estiver sendo executado como o usuário `mysql`, a partição deve ser legível e gravável pelo `mysql`. Se o servidor estiver sendo executado com a opção `--memlock`, o servidor deve ser executado como `root`, então a partição deve ser legível e gravável pelo `root`.

Os procedimentos descritos abaixo envolvem a modificação de arquivos de opção. Para obter informações adicionais, consulte a Seção 6.2.2.2, “Usando arquivos de opção”.

###### Alocar uma Partição de Disco Bruto em Sistemas Linux e Unix

1. Para usar um dispositivo bruto para uma nova instância do servidor, prepare primeiro o arquivo de configuração definindo `innodb_data_file_path` com a palavra-chave `raw`. Por exemplo:

   ```
   [mysqld]
   innodb_data_home_dir=
   innodb_data_file_path=/dev/hdd1:3Graw;/dev/hdd2:2Graw
   ```

   A partição deve ter pelo menos o tamanho especificado. Observe que 1 MB em `InnoDB` é 1024 × 1024 bytes, enquanto 1 MB nas especificações de disco geralmente significa 1.000.000 de bytes.

2. Em seguida, inicie o servidor pela primeira vez usando `--initialize` ou `--initialize-insecure`. O InnoDB percebe a palavra-chave `raw` e inicia a nova partição, e depois ele para o servidor.

3. Agora, reinicie o servidor. `InnoDB` agora permite que alterações sejam feitas.

###### Alocar uma partição de disco bruto no Windows

Nos sistemas Windows, as mesmas etapas e diretrizes que acompanham as descrições para sistemas Linux e Unix se aplicam, exceto que o ajuste `innodb_data_file_path` difere ligeiramente no Windows. Por exemplo:

```
[mysqld]
innodb_data_home_dir=
innodb_data_file_path=//./D::10Graw
```

O `//./` corresponde à sintaxe do Windows do `\\.\` para acessar unidades físicas. No exemplo acima, `D:` é a letra da unidade da partição.
