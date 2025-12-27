### 12.3.10 Compatibilidade com outros SGBD

Para a compatibilidade com o MaxDB, essas duas instruções são iguais:

```
CREATE TABLE t1 (f1 CHAR(N) UNICODE);
CREATE TABLE t1 (f1 CHAR(N) CHARACTER SET ucs2);
```

Tanto o atributo `UNICODE` quanto o conjunto de caracteres `ucs2` estão desatualizados; você deve esperar que eles sejam removidos em uma versão futura do MySQL.