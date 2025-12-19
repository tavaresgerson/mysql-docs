#### 1.7.2.4 "--" como início de um comentário

O SQL padrão usa a sintaxe C `/* this is a comment */` para comentários, e o MySQL Server também suporta essa sintaxe. O MySQL também suporta extensões para essa sintaxe que permitem que o SQL específico do MySQL seja incorporado no comentário; veja Seção 11.7, Comentários.

O MySQL Server também usa `#` como o caractere de comentário inicial.

O SQL padrão também usa `--` como uma sequência de comentário inicial. O MySQL Server suporta uma variante do estilo de comentário `--`; a sequência de comentário inicial `--` é aceita como tal, mas deve ser seguida por um caractere de espaço em branco, como um espaço ou uma nova linha. O espaço destina-se a evitar problemas com consultas SQL geradas que usam construções como as seguintes, que atualizam o saldo para refletir uma carga:

```
UPDATE account SET balance=balance-charge
WHERE account_id=user_id
```

Considere o que acontece quando `charge` tem um valor negativo, como `-1`, que pode ser o caso quando um valor é creditado na conta.

```
UPDATE account SET balance=balance--1
WHERE account_id=5752;
```

`balance--1` é um SQL padrão válido, mas `--` é interpretado como o início de um comentário, e parte da expressão é descartada. O resultado é uma declaração que tem um significado completamente diferente do pretendido:

```
UPDATE account SET balance=balance
WHERE account_id=5752;
```

Para evitar que isso aconteça, o MySQL requer um caractere de espaço em branco após o `--` para que ele seja reconhecido como uma sequência de comentário inicial no MySQL Server, de modo que uma expressão como `balance--1` é sempre segura de usar.
