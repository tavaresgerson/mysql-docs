## 18.1 Configurando o Motor de Armazenamento

Quando você cria uma nova tabela, pode especificar qual motor de armazenamento usar, adicionando uma opção de tabela `ENGINE` à declaração `CREATE TABLE`:

```
-- ENGINE=INNODB not needed unless you have set a different
-- default storage engine.
CREATE TABLE t1 (i INT) ENGINE = INNODB;
-- Simple table definitions can be switched from one to another.
CREATE TABLE t2 (i INT) ENGINE = CSV;
CREATE TABLE t3 (i INT) ENGINE = MEMORY;
```

Quando você omite a opção `ENGINE`, o motor de armazenamento padrão é usado. O motor padrão é `InnoDB` no MySQL 8.0. Você pode especificar o motor padrão usando a opção de inicialização do servidor `--default-storage-engine`, ou definindo a opção `default-storage-engine` no arquivo de configuração do `my.cnf`.

Você pode definir o mecanismo de armazenamento padrão para a sessão atual, definindo a variável `default_storage_engine`:

```
SET default_storage_engine=NDBCLUSTER;
```

O mecanismo de armazenamento para as tabelas `TEMPORARY` criadas com [`CREATE TEMPORARY TABLE`](create-table.html "15.1.20 CREATE TABLE Statement") pode ser configurado separadamente do mecanismo para tabelas permanentes, definindo o `default_tmp_storage_engine`, seja no início ou no runtime.

Para converter uma tabela de um mecanismo de armazenamento para outro, use uma declaração `ALTER TABLE` que indique o novo mecanismo:

```
ALTER TABLE t ENGINE = InnoDB;
```

Veja a Seção 15.1.20, “Instrução CREATE TABLE”, e a Seção 15.1.9, “Instrução ALTER TABLE”.

Se você tentar usar um mecanismo de armazenamento que não foi compilado ou que foi compilado, mas desativado, o MySQL, em vez disso, cria uma tabela usando o mecanismo de armazenamento padrão. Por exemplo, em uma configuração de replicação, talvez seu servidor de origem use tabelas `InnoDB` para máxima segurança, mas os servidores de replicação usam outros mecanismos de armazenamento para velocidade em detrimento da durabilidade ou concorrência.

Por padrão, um aviso é gerado sempre que `CREATE TABLE` ou `ALTER TABLE` não pode usar o mecanismo de armazenamento padrão. Para evitar comportamento confuso e não intencional se o mecanismo desejado estiver indisponível, habilite o modo SQL `NO_ENGINE_SUBSTITUTION`. Se o mecanismo desejado estiver indisponível, essa configuração produz um erro em vez de um aviso, e a tabela não é criada ou alterada. Veja a Seção 7.1.11, “Modos SQL do servidor”.

O MySQL pode armazenar o índice e os dados de uma tabela em um ou mais outros arquivos, dependendo do mecanismo de armazenamento. As definições de tabela e coluna são armazenadas no dicionário de dados do MySQL. Os mecanismos de armazenamento individuais criam quaisquer arquivos adicionais necessários para as tabelas que eles gerenciam. Se o nome de uma tabela contiver caracteres especiais, os nomes dos arquivos da tabela contêm versões codificadas desses caracteres, conforme descrito na Seção 11.2.4, “Mapeamento de Identificadores a Nomes de Arquivos”.