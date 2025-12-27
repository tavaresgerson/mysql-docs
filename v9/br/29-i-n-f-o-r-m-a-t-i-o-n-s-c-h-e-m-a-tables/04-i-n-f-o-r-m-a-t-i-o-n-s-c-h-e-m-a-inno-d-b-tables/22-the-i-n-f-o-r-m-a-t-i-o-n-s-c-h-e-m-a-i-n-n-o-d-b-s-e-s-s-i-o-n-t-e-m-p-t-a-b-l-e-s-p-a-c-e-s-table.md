### 28.4.22 A Tabela INFORMATION_SCHEMA INNODB_SESSION_TEMP_TABLESPACES

A tabela `INNODB_SESSION_TEMP_TABLESPACES` fornece metadados sobre os espaços temporários de tabelas de sessão usados para tabelas temporárias internas e criadas pelo usuário.

A tabela `INNODB_SESSION_TEMP_TABLESPACES` tem as seguintes colunas:

* `ID`

  O ID do processo ou sessão.

* `SPACE`

  O ID do espaço. Um intervalo de 400 mil IDs de espaço é reservado para espaços temporários de tabelas de sessão. Os espaços temporários de tabelas de sessão são recriados toda vez que o servidor é iniciado. Os IDs de espaço não são persistentes quando o servidor é desligado e podem ser reutilizados.

* `PATH`

  O caminho do arquivo de dados do espaço. Um espaço temporário de tabelas de sessão tem a extensão de arquivo `ibt`.

* `SIZE`

  O tamanho do espaço, em bytes.

* `STATE`

  O estado do espaço. `ACTIVE` indica que o espaço está sendo usado atualmente por uma sessão. `INACTIVE` indica que o espaço está no pool de espaços temporários de tabelas de sessão disponíveis.

* `PURPOSE`

  O propósito do espaço. `INTRINSIC` indica que o espaço é usado para tabelas temporárias internas otimizadas pelo otimizador. `SLAVE` indica que o espaço é alocado para armazenar tabelas temporárias criadas pelo usuário em uma replica. `USER` indica que o espaço é usado para tabelas temporárias criadas pelo usuário. `NONE` indica que o espaço não está em uso.

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

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `COLUMNS` de `INFORMATION_SCHEMA` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.