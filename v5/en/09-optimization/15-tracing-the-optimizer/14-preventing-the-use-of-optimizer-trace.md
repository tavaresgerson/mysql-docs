### 8.15.14 Impedindo o Uso do Optimizer Trace

Se, por alguma razão, você desejar impedir que os usuários vejam os traces de suas Queries, inicie o Server com as options mostradas aqui:

```sql
--maximum-optimizer-trace-max-mem-size=0 --optimizer-trace-max-mem-size=0
```

Isso define o tamanho máximo como 0 e impede que os usuários alterem este limite, truncando assim todos os traces para 0 Bytes.