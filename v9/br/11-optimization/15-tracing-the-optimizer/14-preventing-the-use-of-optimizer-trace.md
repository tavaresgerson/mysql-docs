### 10.15.14 Prevenção do uso do rastreamento do otimizador

Se, por algum motivo, você deseja impedir que os usuários vejam os rastros de suas consultas, inicie o servidor com as opções mostradas aqui:

```
--maximum-optimizer-trace-max-mem-size=0 --optimizer-trace-max-mem-size=0
```

Isso define o tamanho máximo em 0 e impede que os usuários alterem esse limite, truncando assim todos os rastros para 0 bytes.