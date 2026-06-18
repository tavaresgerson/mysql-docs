#### 25.6.14.2 Implementação de criptografia do sistema de arquivos NDB

Para a `NDB` Encriptação de Dados Transparente (TDE), os nós de dados criptografam os dados dos usuários em repouso, com segurança fornecida por uma senha (senha do sistema de arquivos), que é usada para criptografar e descriptografar um arquivo de segredos em cada nó de dados. O arquivo de segredos contém uma Chave Mestre de Nó (NMK), uma chave usada mais tarde para criptografar os diferentes tipos de arquivos usados para persistência. `NDB` A TDE criptografa arquivos de dados dos usuários, incluindo arquivos LCP, arquivos de log de redo, arquivos de espaço de tabelas e arquivos de log de desfazer.

Você pode usar o utilitário **ndbxfrm** para verificar se um arquivo está criptografado, como mostrado aqui:

```
> ndbxfrm -i ndb_5_fs/LCP/0/T2F0.Data
File=ndb_5_fs/LCP/0/T2F0.Data, compression=no, encryption=yes
> ndbxfrm -i ndb_6_fs/LCP/0/T2F0.Data
File=ndb_6_fs/LCP/0/T2F0.Data, compression=no, encryption=no
```

A partir da versão NDB 8.0.31, é possível obter a chave do arquivo de segredos usando o programa **ndb\_secretsfile\_reader** adicionado nessa versão, da seguinte maneira:

```
> ndb_secretsfile_reader --filesystem-password=54kl14 ndb_5_fs/D1/NDBCNTR/S0.sysfile
ndb_secretsfile_reader: [Warning] Using a password on the command line interface can be insecure.
cac256e18b2ddf6b5ef82d99a72f18e864b78453cc7fa40bfaf0c40b91122d18
```

A hierarquia de chaves por nó pode ser representada da seguinte forma:

- Uma senha fornecida pelo usuário (P) é processada por uma função de derivação de chave usando um sal aleatório para gerar uma chave de fase de senha única (PK).

- O PK (único para cada nó) criptografa os dados em cada nó em seu próprio arquivo de segredos.

- Os dados no arquivo de segredos incluem uma Chave Mestre de Nó (NMK) única e gerada aleatoriamente.

- O NMK criptografa (usando enrolamento) um ou mais valores de chave de criptografia de dados gerados aleatoriamente (DEK) no cabeçalho de cada arquivo criptografado (incluindo arquivos LCP e TS, além de registros de refazer e desfazer).

- Os valores das chaves de criptografia de dados (DEK0, ..., DEKn) são usados para criptografar \[subconjuntos de] dados em cada arquivo.

A senha criptografa indiretamente o arquivo de segredos que contém o NMK aleatório, que criptografa uma parte do cabeçalho de cada arquivo criptografado no nó. O cabeçalho do arquivo criptografado contém chaves de dados aleatórias usadas para os dados desse arquivo.

A criptografia é implementada de forma transparente pela camada `NDBFS` nos nós de dados. Os blocos internos de clientes `NDBFS` operam com seus arquivos normalmente; `NDBFS` envolve o arquivo físico com informações de cabeçalho e rodapé extras que suportam a criptografia e criptografa e descriptografa os dados conforme eles são lidos e escritos no arquivo. O formato de arquivo envolvido é referido como `ndbxfrm1`.

A senha do nó é processada com PBKDF2 e o sal aleatório para criptografar o arquivo de segredos, que contém o NMK gerado aleatoriamente, que é usado para criptografar a chave de criptografia de dados gerada aleatoriamente em cada arquivo criptografado.

O trabalho de criptografia e descriptografia é realizado nas threads de E/S do NDBFS (em vez de em threads de execução de sinal, como main, tc, ldm ou rep). Isso é semelhante ao que acontece com LCPs comprimidos e backups comprimidos, e normalmente resulta em aumento do uso da CPU das threads de E/S; você pode querer ajustar `ThreadConfig` (se estiver em uso) em relação às threads de E/S.
