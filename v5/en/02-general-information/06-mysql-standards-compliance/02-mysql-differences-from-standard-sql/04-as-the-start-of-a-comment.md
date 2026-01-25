#### 1.6.2.4 '--' como o Início de um Comentário

O SQL Padrão usa a sintaxe C `/* this is a comment */` para comentários, e o MySQL Server também suporta essa sintaxe. O MySQL também suporta extensões a essa sintaxe que permitem que SQL específico do MySQL seja incorporado no comentário; veja Seção 9.6, “Comentários”.

O MySQL Server também usa `#` como o caractere de início de Comment. Isso não é padrão.

O SQL Padrão também usa “`--`” como uma sequência de início de Comment. O MySQL Server suporta uma variante do estilo de Comment `--`; a sequência de início de Comment `--` é aceita como tal, mas deve ser seguida por um caractere de espaço em branco (whitespace character), como um espaço ou uma quebra de linha (newline). O espaço visa prevenir problemas com Queries SQL geradas que utilizam construções como a seguinte, que atualiza o `balance` para refletir um `charge`:

```sql
UPDATE account SET balance=balance-charge
WHERE account_id=user_id
```

Considere o que acontece quando `charge` tem um valor negativo, como `-1`, o que pode ser o caso quando um valor é creditado na conta. Neste caso, o Statement gerado se parece com isto:

```sql
UPDATE account SET balance=balance--1
WHERE account_id=5752;
```

`balance--1` é SQL Padrão válido, mas `--` é interpretado como o início de um Comment, e parte da Expression é descartada. O resultado é um Statement que tem um significado completamente diferente do pretendido:

```sql
UPDATE account SET balance=balance
WHERE account_id=5752;
```

Este Statement não produz alteração alguma no valor. Para evitar que isso aconteça, o MySQL exige um caractere de espaço em branco (whitespace character) após o `--` para que seja reconhecido como uma sequência de início de Comment no MySQL Server, garantindo que uma Expression como `balance--1` seja sempre segura de usar.