### 8.15.14 Prevenção do uso do Rastreador do Optimizer

Se, por algum motivo, você quiser impedir que os usuários vejam as marcas de suas consultas, inicie o servidor com as opções mostradas aqui:

```sql
--maximum-optimizer-trace-max-mem-size=0 --optimizer-trace-max-mem-size=0
```

Isso define o tamanho máximo para 0 e impede que os usuários mudem esse limite, truncando assim todos os registros para 0 bytes.
