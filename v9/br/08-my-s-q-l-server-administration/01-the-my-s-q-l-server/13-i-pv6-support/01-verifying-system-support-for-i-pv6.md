#### 7.1.13.1 Verificar o suporte do sistema para IPv6

Antes que o MySQL Server possa aceitar conexões IPv6, o sistema operacional do seu servidor deve suportar IPv6. Como um teste simples para determinar se isso é verdade, tente este comando:

```
$> ping6 ::1
16 bytes from ::1, icmp_seq=0 hlim=64 time=0.171 ms
16 bytes from ::1, icmp_seq=1 hlim=64 time=0.077 ms
...
```

Para produzir uma descrição das interfaces de rede do seu sistema, inicie o **ifconfig -a** e procure por endereços IPv6 na saída.

Se o seu host não suportar IPv6, consulte a documentação do seu sistema para obter instruções sobre como habilitá-lo. Pode ser que você precise apenas reconfigurar uma interface de rede existente para adicionar um endereço IPv6. Ou pode ser necessário um ajuste mais extenso, como a reconstrução do kernel com as opções IPv6 habilitadas.

Esses links podem ser úteis para configurar o IPv6 em várias plataformas:

[Windows](https://msdn.microsoft.com/en-us/library/dd163569.aspx)
* Gentoo Linux

[Ubuntu Linux](https://wiki.ubuntu.com/IPv6)

* Linux (Geral)

[macOS](https://support.apple.com/en-us/HT202237)