### 28.4.22 A tabela INFORMATION\_SCHEMA INNODB\_SESSION\_TEMP\_TABLESPACES

A tabela `INNODB_SESSION_TEMP_TABLESPACES` fornece metadados sobre os espaços de tabelas temporárias de sessão usados para tabelas temporárias internas e criadas pelo usuário. Esta tabela foi adicionada no MySQL 8.0.13.

A tabela `INNODB_SESSION_TEMP_TABLESPACES` tem essas colunas:

- `ID`

  O ID do processo ou sessão.

- `SPACE`

  O ID do espaço de tabela. Uma faixa de 400 mil IDs de espaço é reservada para espaços de tabela temporários de sessão. Os espaços de tabela temporários de sessão são recriados toda vez que o servidor é iniciado. Os IDs de espaço não são persistentes quando o servidor é desligado e podem ser reutilizados.

- `PATH`

  Caminho do arquivo de dados do espaço de tabelas. Um espaço de tabelas temporário de sessão tem a extensão de arquivo `ibt`.

- `SIZE`

  O tamanho do espaço de tabela, em bytes.

- `STATE`

  O estado do espaço de tabelas. `ACTIVE` indica que o espaço de tabelas está atualmente sendo usado por uma sessão. `INACTIVE` indica que o espaço de tabelas está no conjunto de espaços de tabelas temporárias de sessão disponíveis.

- `PURPOSE`

  O propósito do tablespace. `INTRINSIC` indica que o tablespace é usado para otimizar o uso de tabelas temporárias internas pelo otimizador. `SLAVE` indica que o tablespace é alocado para armazenar tabelas temporárias criadas pelo usuário em um escravo de replicação. `USER` indica que o tablespace é usado para tabelas temporárias criadas pelo usuário. `NONE` indica que o tablespace não está em uso.

#### Exemplo

```
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SESSION_TEMP_TABLESPACES;
+----+------------+----------------------------+-------+----------+-----------+
| ID | SPACE      | PATH                       | SIZE  | STATE    | PURPOSE   |
+----+------------+----------------------------+-------+----------+-----------+
|  8 | 4294566162 | ./#innodb_temp/temp_10.ibt | 81920 | ACTIVE   | INTRINSIC |
|  8 | 4294566161 | ./#innodb_temp/temp_9.ibt  | 98304 | ACTIVE   | USER      |
|  0 | 4294566153 | ./#innodb_temp/temp_1.ibt  | 81920 | INACTIVE | NONE      |
|  0 | 4294566154 | ./#innodb_temp/temp_2.ibt  | 81920 | INACTIVE | NONE      |
|  0 | 4294566155 | ./#innodb_temp/temp_3.ibt  | 81920 | INACTIVE | NONE      |
|  0 | 4294566156 | ./#innodb_temp/temp_4.ibt  | 81920 | INACTIVE | NONE      |
|  0 | 4294566157 | ./#innodb_temp/temp_5.ibt  | 81920 | INACTIVE | NONE      |
|  0 | 4294566158 | ./#innodb_temp/temp_6.ibt  | 81920 | INACTIVE | NONE      |
|  0 | 4294566159 | ./#innodb_temp/temp_7.ibt  | 81920 | INACTIVE | NONE      |
|  0 | 4294566160 | ./#innodb_temp/temp_8.ibt  | 81920 | INACTIVE | NONE      |
+----+------------+----------------------------+-------+----------+-----------+
```

#### Notas

- Você deve ter o privilégio `PROCESS` para consultar esta tabela.

- Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.
