#### 7.1.13.1 Verificação do suporte do sistema ao IPv6

Antes de o MySQL Server poder aceitar conexões IPv6, o sistema operacional do seu servidor deve suportar o IPv6.

```
$> ping6 ::1
16 bytes from ::1, icmp_seq=0 hlim=64 time=0.171 ms
16 bytes from ::1, icmp_seq=1 hlim=64 time=0.077 ms
...
```

Para produzir uma descrição das interfaces de rede do seu sistema, invoque **ifconfig -a** e procure endereços IPv6 na saída.

Se o seu host não suporta o IPv6, consulte a documentação do sistema para obter instruções sobre como habilitá-lo. Pode ser que você só precise reconfigurar uma interface de rede existente para adicionar um endereço IPv6. Ou uma mudança mais extensa pode ser necessária, como reconstruir o kernel com opções IPv6 habilitadas.

Estes links podem ser úteis na configuração do IPv6 em várias plataformas:

- Vidros
- \[Gentoo Linux] (<http://www.gentoo.org/doc/en/ipv6.xml>)
- \[Ubuntu Linux]<https://wiki.ubuntu.com/IPv6>)
- \[Linux (Generic) ] (<http://www.tldp.org/HOWTO/Linux+IPv6-HOWTO/>)
- MacOS
