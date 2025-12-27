### 10.15.14 Prevenção do Uso do Rastreamento do Optimizer

Se, por algum motivo, você deseja impedir que os usuários vejam os rastros de suas consultas, inicie o servidor com as opções mostradas aqui:

```
--maximum-optimizer-trace-max-mem-size=0 --optimizer-trace-max-mem-size=0
```

Isso define o tamanho máximo para 0 e impede que os usuários mudem esse limite, truncando assim todos os rastros para 0 bytes.