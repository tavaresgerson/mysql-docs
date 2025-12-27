## 18.1 Configurando o Motor de Armazenamento

Ao criar uma nova tabela, você pode especificar qual motor de armazenamento usar adicionando uma opção `ENGINE` à instrução `CREATE TABLE`:

```
-- ENGINE=INNODB not needed unless you have set a different
-- default storage engine.
CREATE TABLE t1 (i INT) ENGINE = INNODB;
-- Simple table definitions can be switched from one to another.
CREATE TABLE t2 (i INT) ENGINE = CSV;
CREATE TABLE t3 (i INT) ENGINE = MEMORY;
```

Quando você omite a opção `ENGINE`, o motor de armazenamento padrão é usado. O motor padrão é `InnoDB` no MySQL 9.5. Você pode especificar o motor padrão usando a opção de inicialização do servidor `--default-storage-engine`, ou configurando a opção `default-storage-engine` no arquivo de configuração `my.cnf`.

Você pode definir o motor de armazenamento padrão para a sessão atual configurando a variável `default_storage_engine`:

```
SET default_storage_engine=NDBCLUSTER;
```

O motor de armazenamento para tabelas `TEMPORARY` criadas com `CREATE TEMPORARY TABLE` pode ser definido separadamente do motor para tabelas permanentes configurando a `default_tmp_storage_engine`, seja na inicialização ou no runtime.

Para converter uma tabela de um motor de armazenamento para outro, use uma instrução `ALTER TABLE` que indique o novo motor:

```
ALTER TABLE t ENGINE = InnoDB;
```

Veja a Seção 15.1.24, “Instrução CREATE TABLE”, e a Seção 15.1.11, “Instrução ALTER TABLE”.

Se você tentar usar um motor de armazenamento que não está compilado ou que está compilado, mas desativado, o MySQL cria, em vez disso, uma tabela usando o motor de armazenamento padrão. Por exemplo, em uma configuração de replicação, talvez o servidor de origem use tabelas `InnoDB` para máxima segurança, mas os servidores de replicação usem outros motores de armazenamento para velocidade em detrimento da durabilidade ou concorrência.

Por padrão, um aviso é gerado sempre que o `CREATE TABLE` ou `ALTER TABLE` não pode usar o mecanismo de armazenamento padrão. Para evitar comportamentos confusos e não intencionais se o mecanismo desejado estiver indisponível, habilite o modo SQL `NO_ENGINE_SUBSTITUTION`. Se o mecanismo desejado estiver indisponível, essa configuração produz um erro em vez de um aviso, e a tabela não é criada ou alterada. Veja a Seção 7.1.11, “Modos SQL do Servidor”.

O MySQL pode armazenar o índice e os dados de uma tabela em um ou mais outros arquivos, dependendo do mecanismo de armazenamento. As definições da tabela e das colunas são armazenadas no dicionário de dados do MySQL. Os mecanismos de armazenamento individuais criam quaisquer arquivos adicionais necessários para as tabelas que gerenciam. Se o nome de uma tabela contiver caracteres especiais, os nomes dos arquivos da tabela contêm versões codificadas desses caracteres, conforme descrito na Seção 11.2.4, “Mapeamento de Identificadores para Nomes de Arquivos”.