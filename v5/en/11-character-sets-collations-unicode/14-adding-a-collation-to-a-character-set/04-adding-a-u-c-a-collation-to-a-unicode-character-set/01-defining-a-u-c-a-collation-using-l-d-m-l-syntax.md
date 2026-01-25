#### 10.14.4.1 Definindo um Collation UCA Usando Sintaxe LDML

Para adicionar um collation UCA para um character set Unicode sem recompilar o MySQL, use o procedimento a seguir. Se você não estiver familiarizado com as regras LDML usadas para descrever as características de ordenação (sort) do collation, consulte a Seção 10.14.4.2, “Sintaxe LDML Suportada no MySQL”.

O exemplo adiciona um collation chamado `utf8_phone_ci` ao character set `utf8`. O collation é projetado para um cenário envolvendo uma aplicação Web na qual usuários postam seus nomes e números de telefone. Os números de telefone podem ser fornecidos em formatos muito diferentes:

```sql
+7-12345-67
+7-12-345-67
+7 12 345 67
+7 (12) 345 67
+71234567
```

O problema levantado ao lidar com esses tipos de valores é que os variados formatos permitidos tornam a busca por um número de telefone específico muito difícil. A solução é definir um novo collation que reordena caracteres de pontuação, tornando-os ignoráveis.

1. Escolha um Collation ID, conforme mostrado na Seção 10.14.2, “Escolhendo um Collation ID”. As etapas a seguir usam o ID 1029.

2. Para modificar o arquivo de configuração `Index.xml`. Este arquivo está localizado no diretório nomeado pela variável de sistema `character_sets_dir`. Você pode verificar o valor da variável da seguinte forma, embora o nome do caminho possa ser diferente no seu sistema:

   ```sql
   mysql> SHOW VARIABLES LIKE 'character_sets_dir';
   +--------------------+-----------------------------------------+
   | Variable_name      | Value                                   |
   +--------------------+-----------------------------------------+
   | character_sets_dir | /user/local/mysql/share/mysql/charsets/ |
   +--------------------+-----------------------------------------+
   ```

3. Escolha um nome para o collation e liste-o no arquivo `Index.xml`. Além disso, você precisará fornecer as regras de ordenação do collation. Encontre o elemento `<charset>` para o character set ao qual o collation está sendo adicionado e adicione um elemento `<collation>` que indica o nome e o ID do collation, para associar o nome ao ID. Dentro do elemento `<collation>`, forneça um elemento `<rules>` contendo as regras de ordenação:

   ```sql
   <charset name="utf8">
     ...
     <collation name="utf8_phone_ci" id="1029">
       <rules>
         <reset>\u0000</reset>
         <i>\u0020</i> <!-- space -->
         <i>\u0028</i> <!-- left parenthesis -->
         <i>\u0029</i> <!-- right parenthesis -->
         <i>\u002B</i> <!-- plus -->
         <i>\u002D</i> <!-- hyphen -->
       </rules>
     </collation>
     ...
   </charset>
   ```

4. Se você quiser um collation semelhante para outros character sets Unicode, adicione outros elementos `<collation>`. Por exemplo, para definir `ucs2_phone_ci`, adicione um elemento `<collation>` ao elemento `<charset name="ucs2">`. Lembre-se de que cada collation deve ter seu próprio ID exclusivo.

5. Reinicie o server e use esta instrução para verificar se o collation está presente:

   ```sql
   mysql> SHOW COLLATION WHERE Collation = 'utf8_phone_ci';
   +---------------+---------+------+---------+----------+---------+
   | Collation     | Charset | Id   | Default | Compiled | Sortlen |
   +---------------+---------+------+---------+----------+---------+
   | utf8_phone_ci | utf8    | 1029 |         |          |       8 |
   +---------------+---------+------+---------+----------+---------+
   ```

Agora teste o collation para garantir que ele tenha as propriedades desejadas.

Crie uma table contendo alguns números de telefone de exemplo usando o novo collation:

```sql
mysql> CREATE TABLE phonebook (
         name VARCHAR(64),
         phone VARCHAR(64) CHARACTER SET utf8 COLLATE utf8_phone_ci
       );
Query OK, 0 rows affected (0.09 sec)

mysql> INSERT INTO phonebook VALUES ('Svoj','+7 912 800 80 02');
Query OK, 1 row affected (0.00 sec)

mysql> INSERT INTO phonebook VALUES ('Hf','+7 (912) 800 80 04');
Query OK, 1 row affected (0.00 sec)

mysql> INSERT INTO phonebook VALUES ('Bar','+7-912-800-80-01');
Query OK, 1 row affected (0.00 sec)

mysql> INSERT INTO phonebook VALUES ('Ramil','(7912) 800 80 03');
Query OK, 1 row affected (0.00 sec)

mysql> INSERT INTO phonebook VALUES ('Sanja','+380 (912) 8008005');
Query OK, 1 row affected (0.00 sec)
```

Execute algumas Queries para verificar se os caracteres de pontuação ignorados são de fato ignorados para comparação e ordenação (sorting):

```sql
mysql> SELECT * FROM phonebook ORDER BY phone;
+-------+--------------------+
| name  | phone              |
+-------+--------------------+
| Sanja | +380 (912) 8008005 |
| Bar   | +7-912-800-80-01   |
| Svoj  | +7 912 800 80 02   |
| Ramil | (7912) 800 80 03   |
| Hf    | +7 (912) 800 80 04 |
+-------+--------------------+
5 rows in set (0.00 sec)

mysql> SELECT * FROM phonebook WHERE phone='+7(912)800-80-01';
+------+------------------+
| name | phone            |
+------+------------------+
| Bar  | +7-912-800-80-01 |
+------+------------------+
1 row in set (0.00 sec)

mysql> SELECT * FROM phonebook WHERE phone='79128008001';
+------+------------------+
| name | phone            |
+------+------------------+
| Bar  | +7-912-800-80-01 |
+------+------------------+
1 row in set (0.00 sec)

mysql> SELECT * FROM phonebook WHERE phone='7 9 1 2 8 0 0 8 0 0 1';
+------+------------------+
| name | phone            |
+------+------------------+
| Bar  | +7-912-800-80-01 |
+------+------------------+
1 row in set (0.00 sec)
```