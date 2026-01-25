#### 5.1.12.1 Verificando o Suporte do Sistema para IPv6

Antes que o MySQL Server possa aceitar conexões IPv6, o *operating system* (sistema operacional) no seu *host* de servidor deve suportar IPv6. Como um teste simples para determinar se isso é verdade, tente este comando:

```sql
$> ping6 ::1
16 bytes from ::1, icmp_seq=0 hlim=64 time=0.171 ms
16 bytes from ::1, icmp_seq=1 hlim=64 time=0.077 ms
...
```

Para produzir uma descrição das *interfaces* de rede do seu sistema, invoque **ifconfig -a** e procure por *IPv6 addresses* na saída.

Se o seu *host* não suporta IPv6, consulte a documentação do seu sistema para obter instruções sobre como habilitá-lo. Pode ser que você precise apenas reconfigurar uma *network interface* existente para adicionar um *IPv6 address*. Ou pode ser necessária uma mudança mais extensa, como reconstruir o *kernel* com as opções de IPv6 habilitadas.

Estes links podem ser úteis para configurar o IPv6 em várias plataformas:

* [Windows](https://msdn.microsoft.com/en-us/library/dd163569.aspx)
* [Gentoo Linux](http://www.gentoo.org/doc/en/ipv6.xml)
* [Ubuntu Linux](https://wiki.ubuntu.com/IPv6)
* [Linux (Generic)](http://www.tldp.org/HOWTO/Linux+IPv6-HOWTO/)
* [macOS](https://support.apple.com/en-us/HT202237)