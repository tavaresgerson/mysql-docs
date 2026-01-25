### 10.14.3 Adicionando uma Collation Simples a um Character Set de 8-Bit

Esta seção descreve como adicionar uma Collation simples para um Character Set de 8-bit, escrevendo os elementos `<collation>` associados a uma descrição de Character Set `<charset>` no arquivo `Index.xml` do MySQL. O procedimento descrito aqui não requer a recompilação do MySQL. O exemplo adiciona uma Collation chamada `latin1_test_ci` ao Character Set `latin1`.

1. Escolha um Collation ID, conforme mostrado na Seção 10.14.2, “Escolhendo um Collation ID”. Os passos seguintes usam o ID 1024.

2. Modifique os arquivos de configuração `Index.xml` e `latin1.xml`. Esses arquivos estão localizados no diretório nomeado pela variável de sistema `character_sets_dir`. Você pode verificar o valor da variável da seguinte forma, embora o nome do caminho possa ser diferente em seu sistema:

   ```sql
   mysql> SHOW VARIABLES LIKE 'character_sets_dir';
   +--------------------+-----------------------------------------+
   | Variable_name      | Value                                   |
   +--------------------+-----------------------------------------+
   | character_sets_dir | /user/local/mysql/share/mysql/charsets/ |
   +--------------------+-----------------------------------------+
   ```

3. Escolha um nome para a Collation e liste-o no arquivo `Index.xml`. Encontre o elemento `<charset>` para o Character Set ao qual a Collation está sendo adicionada e adicione um elemento `<collation>` que indique o nome e o ID da Collation, para associar o nome ao ID. Por exemplo:

   ```sql
   <charset name="latin1">
     ...
     <collation name="latin1_test_ci" id="1024"/>
     ...
   </charset>
   ```

4. No arquivo de configuração `latin1.xml`, adicione um elemento `<collation>` que nomeia a Collation e que contém um elemento `<map>` que define uma tabela de mapeamento de código de caractere para peso (character code-to-weight mapping table) para códigos de caractere de 0 a 255. Cada valor dentro do elemento `<map>` deve ser um número em formato hexadecimal.

   ```sql
   <collation name="latin1_test_ci">
   <map>
    00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F
    10 11 12 13 14 15 16 17 18 19 1A 1B 1C 1D 1E 1F
    20 21 22 23 24 25 26 27 28 29 2A 2B 2C 2D 2E 2F
    30 31 32 33 34 35 36 37 38 39 3A 3B 3C 3D 3E 3F
    40 41 42 43 44 45 46 47 48 49 4A 4B 4C 4D 4E 4F
    50 51 52 53 54 55 56 57 58 59 5A 5B 5C 5D 5E 5F
    60 41 42 43 44 45 46 47 48 49 4A 4B 4C 4D 4E 4F
    50 51 52 53 54 55 56 57 58 59 5A 7B 7C 7D 7E 7F
    80 81 82 83 84 85 86 87 88 89 8A 8B 8C 8D 8E 8F
    90 91 92 93 94 95 96 97 98 99 9A 9B 9C 9D 9E 9F
    A0 A1 A2 A3 A4 A5 A6 A7 A8 A9 AA AB AC AD AE AF
    B0 B1 B2 B3 B4 B5 B6 B7 B8 B9 BA BB BC BD BE BF
    41 41 41 41 5B 5D 5B 43 45 45 45 45 49 49 49 49
    44 4E 4F 4F 4F 4F 5C D7 5C 55 55 55 59 59 DE DF
    41 41 41 41 5B 5D 5B 43 45 45 45 45 49 49 49 49
    44 4E 4F 4F 4F 4F 5C F7 5C 55 55 55 59 59 DE FF
   </map>
   </collation>
   ```

5. Reinicie o servidor e use esta instrução para verificar se a Collation está presente:

   ```sql
   mysql> SHOW COLLATION WHERE Collation = 'latin1_test_ci';
   +----------------+---------+------+---------+----------+---------+
   | Collation      | Charset | Id   | Default | Compiled | Sortlen |
   +----------------+---------+------+---------+----------+---------+
   | latin1_test_ci | latin1  | 1024 |         |          |       1 |
   +----------------+---------+------+---------+----------+---------+
   ```