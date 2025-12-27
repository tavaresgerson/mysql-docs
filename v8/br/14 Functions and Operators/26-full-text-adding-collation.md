### 14.9.7 Adicionando uma Colagem Definida pelo Usuário para Indexação de Texto Completo

Aviso

As colágias definidas pelo usuário estão desatualizadas; você deve esperar que o suporte a elas seja removido em uma versão futura do MySQL. O servidor emite um aviso para qualquer uso de `COLLATE user_defined_collation` em uma instrução SQL; um aviso também é emitido quando o servidor é iniciado com `--collation-server` definido igual ao nome de uma colágias definida pelo usuário.

Esta seção descreve como adicionar uma colágias definida pelo usuário para pesquisas de texto completo usando o analisador de texto completo integrado. A colágias de exemplo é como `latin1_swedish_ci`, mas trata o caractere `'-'` como uma letra em vez de como um caractere de pontuação, para que possa ser indexado como um caractere de palavra. Informações gerais sobre a adição de colágias são dadas na Seção 12.14, “Adicionando uma Colagem a um Conjunto de Caracteres”; presume-se que você as leu e está familiarizado com os arquivos envolvidos.

Para adicionar uma colágias para indexação de texto completo, use o seguinte procedimento. As instruções aqui adicionam uma colágias para um conjunto de caracteres simples, que, conforme discutido na Seção 12.14, “Adicionando uma Colagem a um Conjunto de Caracteres”, pode ser criada usando um arquivo de configuração que descreve as propriedades do conjunto de caracteres. Para um conjunto de caracteres complexo como o Unicode, crie colágias usando arquivos de código C que descrevem as propriedades do conjunto de caracteres.

1. Adicione uma colágias ao arquivo `Index.xml`. A faixa permitida de IDs para colágias definidas pelo usuário é dada na Seção 12.14.2, “Escolhendo um ID de Colagem”. O ID deve ser inutilizado, então escolha um valor diferente de 1025 se esse ID já estiver ocupado no seu sistema.

   ```
   <charset name="latin1">
   ...
   <collation name="latin1_fulltext_ci" id="1025"/>
   </charset>
   ```
2. Declare a ordem de classificação para a colágias no arquivo `latin1.xml`. Neste caso, a ordem pode ser copiada de `latin1_swedish_ci`:

3. Modifique o array `ctype` em `latin1.xml`. Altere o valor correspondente a 0x2D (que é o código para o caractere `'-'` ) de 10 (ponto) para 01 (letra maiúscula). No array a seguir, este é o elemento na quarta linha da esquerda, terceiro valor a partir do final.

```
   <collation name="latin1_fulltext_ci">
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
   41 41 41 41 5C 5B 5C 43 45 45 45 45 49 49 49 49
   44 4E 4F 4F 4F 4F 5D D7 D8 55 55 55 59 59 DE DF
   41 41 41 41 5C 5B 5C 43 45 45 45 45 49 49 49 49
   44 4E 4F 4F 4F 4F 5D F7 D8 55 55 55 59 59 DE FF
   </map>
   </collation>
   ```
4. Reinicie o servidor.
5. Para utilizar a nova codificação, inclua-a na definição das colunas que devem usá-la:

```
   <ctype>
   <map>
   00
   20 20 20 20 20 20 20 20 20 28 28 28 28 28 20 20
   20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20
   48 10 10 10 10 10 10 10 10 10 10 10 10 01 10 10
   84 84 84 84 84 84 84 84 84 84 10 10 10 10 10 10
   10 81 81 81 81 81 81 01 01 01 01 01 01 01 01 01
   01 01 01 01 01 01 01 01 01 01 01 10 10 10 10 10
   10 82 82 82 82 82 82 02 02 02 02 02 02 02 02 02
   02 02 02 02 02 02 02 02 02 02 02 10 10 10 10 20
   10 00 10 02 10 10 10 10 10 10 01 10 01 00 01 00
   00 10 10 10 10 10 10 10 10 10 02 10 02 00 02 01
   48 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10
   10 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10
   01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01
   01 01 01 01 01 01 01 10 01 01 01 01 01 01 01 02
   02 02 02 02 02 02 02 02 02 02 02 02 02 02 02 02
   02 02 02 02 02 02 02 10 02 02 02 02 02 02 02 02
   </map>
   </ctype>
   ```
6. Teste a codificação para verificar se o hífen é considerado como um caractere de palavra:

```
   mysql> DROP TABLE IF EXISTS t1;
   Query OK, 0 rows affected (0.13 sec)

   mysql> CREATE TABLE t1 (
       a TEXT CHARACTER SET latin1 COLLATE latin1_fulltext_ci,
       FULLTEXT INDEX(a)
       ) ENGINE=InnoDB;
   Query OK, 0 rows affected (0.47 sec)
   ```